---
title: GIL이 무엇일까?
subTitle: 
category: "Python"
cover: ../python.png
---


[Python wiki](https://wiki.python.org/moin/GlobalInterpreterLock) 에 따르면 **GIL** (Global Interpreter Lock)을 다음과 같이 설명합니다.

> In CPython, the **global interpreter lock**, or **GIL**, is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once. This lock is necessary mainly because **CPython's memory management is not thread-safe.**



이를 한글로 번역한다면 다음과 같습니다.

> CPython에서 **GIL**은 Python bytecodes를 실행할 때 여러 thread를 사용할 경우, 단 하나의 thread만이 Python objects에 접근할 수 있도록 제한하는 mutex 이다. 이 잠금장치가 필요한 이유는 **CPython의 메모리 관리법이 thread-safe 하지 않기 때문이다.**



GIL은 어디까지나 Python의 표준 Interprementation인 `CPython`에 대한 제한임을 인지해야 합니다.

CPython에서는 사용자가 무분별하게 multi-threading 작업을 하지 못하게 원천 봉쇄를 하였는데, 그 이유는 Python이 만들어질 시기에는 thread라는 개념이 없었을 시기였습니다. 더욱이 Python의 창시자인 [Guido van Rossum](https://en.wikipedia.org/wiki/Guido_van_Rossum)은 플랫폼 독립적이며 인터프리터식이며 객체지향적, 동적 타이핑이 가능한 고급 프로그래밍 언어를 만들고자 했습니다.

이러한 장점들로 인해 Python 사용자들은 폭발적으로 늘어나게되며 커뮤니티 또한 활성화 됩니다. 하지만 시간이 지나고 thread 개념이 확립되며 거대한 커뮤니티에서 만들어낸 수 많은 C extetnsion들을 새로운 메모리 관리 방법에 맞춰 바꿔야하는 문제에 봉착하게 됩니다. 이는 현실적으로 불가능했고, 대신 Python 스크립트 실행시키는 CPython 자체에 lock을 거는 방법인 GIL을 도입해 문제를 해결했습니다. 

그렇다면 왜 CPython에서는 GIL을 도입할 수 밖에 없었을까요?



### Python의 interpreter와 성능

Python은 Interpreter를 통해 코드를 해석합니다. 사용자가 작성한 코드를 실행시키면 interpreter라는 프로그램이 먼저 메모리에 올라가게 되고 코드를 줄 단위로 해석해 명령을 수행합니다. 이때 사용되는 Interpreter 중 가장 많이 사용되는 것이 바로CPython이 입니다. 그리고 Python의 객체 역시 다른 언어와 동일한 데이터를 가진 객체라도 훨씬 덩치가 큽니다. 또한 C, C++, JAVA와 같은 대부분의 Compile 언어들과는 다르게 메모리 관리를 자동으로 해준다는 장점을 가지고 있습니다. 

이처럼 Python은 성능은 낮은 스크립트 언어이지만 진입장벽이 낮아 많은 사람들에게 사랑받는 언어가 될 수 있었습니다.



### Python의 메모리 관리 1 - Reference Counting

그렇다면 Python은 어떻게 메모리 관리를 자동으로 할 수 있을까요?

Python은 객체의 생성과 소멸을 **reference count** (refcount)를 통해 관리합니다. refcount란 모든 객체가 가지고 있는 기본적인 속성으로 자신을 몇 군데에서 참조하고 있는지에 대한 데이터입니다. 우리는 아래와 같은 방법으로 reference의 갯수를 확인할 수 있습니다.

```
>>> import sys
>>> a = []
>>> b = a
>>> sys.getrefcount(a)
3
```

- `a` 가 만들어졌을때 reference 1개 
- `b` 에 `a` 의 regerence를 할당으므로 reference 1개가 추가되어 총 2개
- `sys.getrefcount` 함수에 argument로 `a` 가 들어가서, 함수 내부에서 `a` 의 reference를 하나 임시로 할당하므로 1개 추가되어 총 3개(이 함수가 종료되면 다시 한개가 줄어 총 2개가 됩니다)

이렇게 Interpreter는 객체의  reference의 갯수를 체크며 메모리를 할당하게 되고, 이게 0이되면 Interpreter는 알아서 메모리를 회수합니다.



### Python의 메모리 관리 2 - Race Condition

Python wiki의 GIL 정의에 따르면 CPython은 "thread-safe 하지 않다"라는 문구가 나옵니다. 하나의 process 내부의 thread들은 process가 공유하는 메모리에 접근할 수 있는데, 이로인해 메모리 유실이 발생할 수 있습니다. 아래의 코드를 통해 이 문제를 경험해볼 수 있습니다.

```python
import threading

x = 0 # A shared value

def foo():
    global x for i in range(100000000):
    x += 1
    
def bar():
    global x for i in range(100000000):
    x -= 1
    
t1 = threading.Thread(target=foo)
t2 = threading.Thread(target=bar)

t1.start()
t2.start()

t1.join()
t2.join() # Wait for completion

print(x)
```



상식적으로 생각해보면  `print(x)`의 결과는 0이 나올것이라고 예상할 수 있습니다. 

하지만 실제 위 코드를 실행 시키면 `x`의 값은 이상한 숫자를 리턴하게 됩니다. 그 이유는 전역변수 `x`에 두 개의 thread가 동시에 접근해서 각자의 작업을 하면서 어느 한 쪽의 작업 결과가 반영되지 않기 때문입니다. 이렇게 두 개 이상의 thread가 공유된 데이를 변경함으로써 발생되는 문제를 **race condition**이라고 부릅니다. 

따라서 "thread-safe"하다는 것은 thread들이 race condition을 발생 시키지 않으면서 각자의 일을 수행하는 것을 의미합니다.

CPython은 이 문제를 해결하기 위해 mutex (mutual exclusion)라는 기술을 사용했습니다. 위 코드에서처럼 예상하지 않은 결과가 발생하지 않도록 공유되는 메모리의 데이터를 여러 thread가 동시에 사용할 수 없도록 잠그는 일을 mutex가 맡습니다.

다음은  [Stackoverflow](https://stackoverflow.com/questions/4989451/mutex-example-tutorial)에 있는 mutex에 대해 아주 잘 묘사한 글 입니다.

> 휴대폰이 없던 시절에는 공중 전화를 주로 이용했었다. 거리의 모든 남자들은 각자의 아내에게 전화를 너무나 걸고 싶어한다.
>
> 어떤 한 남자가 처음으로 공중 전화 부스에 들어가서 그의 사랑하는 아내에게 전화를 걸었다면, 그는 꼭 전화 부스의 문을 꼭 잡고 있어야 한다. 왜냐하면 사랑에 눈이 먼 다른 남자들이 전화를 걸기 위해 시도때도 없이 달려들고 있기 때문이다. 줄 서는 질서 문화 따위는 없다. 심지어 그 문을 놓친다면, 전화 부스에 들이닥친 남자들이 수화기를 뺏어 당신의 아내에게 애정 표현을 할 지도 모른다.
>
> 아내와의 즐거운 통화를 무사히 마쳤다면, 이제 문을 잡고 있던 손을 놓고 부스 밖으로 나가면 된다. 그러면 공중 전화를 쓰기 위해 달려드는 다른 남자들 중 제일 빠른 한 명이 부스에 들어가서 똑같이 문을 꼭 잡고 그의 아내와 통화할 수 있다.

이 이야기를 thread 개념에 하나씩 대입할 수 있습니다.

- Thread: 각 남자들
- Mutex: 공중 전화 부스의 문
- lock: 그 문을 잡고 있는 남자
- Resource: 공중 전화



따라서 어느 한 **thread**(남자1)가 최초로 **mutex**(공중 전화 부스의 문)를 가져갔다면 그 thread(남자1)는 자신의 일을 계속 진행할 수 있습니다. 반면, 다른 **thread**(남자2)가 mutex를 가져가려고 한다면, 첫 번째로 mutex를 가져간 thread(남자1)가 그 잠금을 풀 때까지 기다려야 합니다. 그렇게 mutex의 잠금이 해제되면 그제서야 두 번째 thread(남자2)가 mutex를 받아 다음 일을 진행 할 수 있습니다. 

이때 race condition이 발생한다면 일의 진행도를 파악할 수 없기 때문에 mutex를 이용해서 각 thread의 동시적인 접근을 막는 것입니다.



### 그래서 GIL이란?

종합적으로 보면 CPython은 사용자가 컨트롤하지 않아도 refernce count를 체크해 메모리를 자동으로 관리해 줍니다. 하지만 reference counting 도중 race condition이 일어난 다면 memory leak이 발생할 수 있습니다. 이를 해결하기 위해 mutex를 이용하지만 refcount 값을 바꾸는 모든 객체 하나하나마다 mutex를 설정하게 된다면 여러개의 mutex 끊임 없이 사용해 성능적으로 손해를 볼 뿐만 아니라 deadlock이라는 치명적인 이슈를 발생할 수 있습니다.

결과적으로 CPython은 mutex를 통해 모든 refcount를 일이 보호하지 말고, Python Interpreter 자체를 잠그기로 했습니다. Interpreter 하나만 mutex로 보호한다면 성능저하 문제를 고려하지 않아도 되기 때문입니다. 하지만 이 말은 한번에 하나의 thread만이 작업을 진행할 수 있게 되어 병렬처리가 불가능해 졌다고 볼 수 있습니다. 병렬처리가 활성화 된 이 시기에 Pythonista들에게는 안좋은 결과입니다. 

이 문제에 대해 Python의 창시자 귀도 반 로섬 역시 많은 고민을 해 내놓은 해결책이 GIL이고 더 나은 방법을 찾기 위해 커뮤니티에 도움을 요청하기도 했습니다. 아래 글을 귀도 반 로섬이 2007년에 작성한 GIL에 대한 [블로그](https://www.artima.com/weblogs/viewpost.jsp?thread=214235)에서 발췌한 내용입니다.

> I'd welcome a set of patches into Py3k *only if* the performance for a single-threaded program (and for a multi-threaded but I/O-bound program) *does not decrease.*
>
> 단일 thread 프로그램에서의 성능을 저하시키지 않고 GIL의 문제점을 개선할 수 있다면, 나는 그 개선안을 기꺼이 받아들일 것이다.

하지만 12년이 지난 지금까지도 GIL의 개선안은 등장하지 않았습니다.



### 마치며

많은 사람들은 **multi-thread**가 굳이 아니더라도 **multi-processing**으로 처리하면 된다는 말을 합니다. 물론 `multiprocessing`과 `asyncio` 등 의 모듈을 사용하면 된다고는 하지만 이 또한 근본적인 해결책은 되지 못합니다. multiprocessing은 실제로 병렬처리가 가능하지만 process간 발생하는 비용이 상당히 크기 때문에 사용할 수 있는 조건이 상당히 제한됩니다. 또한 `CPython`이 아닌 `JPython`, `IronPython`,`Stackless Python`, `PyPy`등의 다른 인터프리터를 이용해 병렬처리를 시도할 수 있지만 이 또한 별도의 유닛 단위에서나 가능한 일입니다. 병렬처리가 이슈가 된다면 대부분의 경우 프로젝트가 거대해진 상황인데 인터프리터를 갈아탄다는 것은 쉬운 선택이 아닐것 입니다.

아쉽지만 모든 프로그래밍 언어가 완벽하지 않듯이 Python 또한 그렇습니다. 빅데이터와 AI가 이슈화 되면서 Python은 계속해서 성장하고 있지만 GIL은 Python의 성장을 발목잡는 이슈중 하나 입니다.

Python은 수 많은 프로그래밍 언어 중 하나일 뿐이며 단순 도구에 불가하다고 생각합니다. 우리는 늘 그래왔듯이 그때그때 상황에 맞는 최선의 도구를 사용해 개발을 하면 될 것입니다. 