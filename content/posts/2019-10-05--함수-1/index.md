---
title: 함수 1
subTitle: 위치 매개변수와 키워드 매개변수를 받는 함수
category: "Python"
cover: ../python.png
---

## 매개변수의 개수가 정해지지 않은 함수 작성
위치 매개변수의 개수가 지정되지 않은 함수를 정의할 때는 `*` 인자를 사용하면 된다.

```python
def average(first, *nums):
    return (first + sum(nums)) / (1 + len(nums))

average(1, 2)           # 1.5
average(1, 2, 3, 4)     # 2.5
```
위 `average` 함수에서 추가적인 위치 매개변수들은 튜플로 들어간다.

<br>

또한, 키워드 매개변수 개수에 제한이 없는 함수를 작성하려면 `**` 로 싯작하는 인자를 사용하면 된다.
```python
import html

def make_element(name, value, **attrs):
    keyvals = [' %s="%s"' % item for item in attrs.items()]
    attr_str = ''.join(keyvals)
    element = '<{name} {attrs}>{value}</{name}>'.format(
        name=name,
        attrs=attr_str,
        value=html.escape(value)
    )
    return element

make_element('item', 'Albatross', size='large', quantity=6)
# '<item size="large" quantity="6">Albatross</item>'

make_element('p', '<spam>')
# '<p>&lt;spam&gt;</p>'
```
위 `make_element` 함수에서 추가적인 키워드 매개변수들은 딕셔너리로 들어간다.

이렇게 함수의 인풋으로 받을 인자들의 개수가 정의되지 않은 경우에는 `*` , `**`를 사용해서 인자를 정의하면 된다. 단, 하나의 함수에 각각 한번씩만 사용 가능하며, 모든 위치 매개변수는 튜플에, 모든 키워드 매개변수는 딕셔너리에 들어간다.

<br>

## 키워드 매개변수만 받는 함수 작성
키워드로 지정한 특정 매개변수만 받는 함수를 만드려면 아래와 같이 함수를 정의하면 된다.

```python
def receiver(maxsize, *, block):
    'Receives a message'
    pass

receiver(1024, True)            # TypeError
receiver(1024, block=True)      # Ok
```
이 기능은 키워드 매개변수를 `*` 뒤에 넣거나 이름 없이 `*` 만 사용하면 간단히 구현할 수 있다. 이 기술로 숫자가 다른 위치 매개변수를 받는 함수에 키워드 매개변수를 명시할 때 사용할 수도 있다.
```python
def mininum(*values, clip=None):
    m = min(values)
    if clip is not None:
        m = clip if clip > m else m
    return m

mininum(1, 5, 2, -5, 10)            # -5
mininum(1, 5, 2, -5, 10, clip=0)    # 0
```

키워드로만 넣을 수 있는(keyword-only) 인자는 추가적 함수 인자를 명시할 때 코드의 가독성을 높이는 좋은 수단이 될 수 있다.
> msg = receiver(1024, False)

`receiver()`가 어떻게 동작하는지 잘 모른다면 `False` 인자가 무엇을 의미하는지 모를것이다. 따라서 가독성 높은 코드를 위해 아래와 같이 명시적으로 표시해 주는게 좋을것이다.
> msg = receiver(1024, block=False)

다른 사람들이 짠 함수에 키워드로만 넣을수 있는 인자가 있다면 아래의 방법을 이용해 함수가 정의된 코드를 확인할 수 있다.
```bash
>>> help(receiver)
Help on function receiver in module __main__:

receiver(maxsize, *, block)
    Receives a message
>>>
```

<br>

## 함수 인자에 메타데이터 넣기
함수를 작성했다면 다른사람이 함수를 어떻게 사용해야 하는지 알 수 있도록 하는게 좋을것이다. 주로 주석을 사용해서 `README`를 작성할 수 있겠지만 Python이 제공하는 주석이 붙은 함수를 작성할 수도 있다.
```python
def add(x:int, y:int) -> int:
    return x + y
```
Python 인터프리터는 주석에 어떠한 의미도 부여하지 않는다. 타입을 확인하지도 않고 Python의 실행 방식에도 영향을 주지 않는다. 오직 소스 코드를 읽는 사람들이 이애하기 쉽도록 설명해 줄 뿐이다.
```bash
>>> help(add)
Help on function add in module __main__:

add(x: int, y: int) -> int
>>>
```
어떠한 객체도(예: 숫자, 문자역, 인스턴스) 주석으로 붙일 수 있지만, 주로 클래스나 문자열을 주석으로 붙힌다. 이 주석은 함수의 `__annotations__` 속성에 저장된다.
```bash
>>> add.__annotations__
{'x': <class 'int'>, 'y': <class 'int'>, 'return': <class 'int'>}
>>>
```
주석을 활용할 수 있는 방법은 많지만, 기본적으로는 문서화에 도움을 주기 위해 사용한다. 자신의 코드를 오픈소스로 배포하고 싶다면 다른 사람들을 위해 주석을 작성하는 것이 코드의 완성도를 높히는 방법 중 하나일 것이다.

<br>

## 함수에서 여러 값을 반환
함수에서 여러개의 결과를 한번에 반환하고 싶다면 아래와 같은 방법을 사용하면 된다.
```python
def function():
    return 1, 2, 3

a, b, c = function()
print(a)        # 1
print(b)        # 2
print(c)        # 3
```
위 코드를 보면 `function()` 함수에서 여러개의 값이 반환된 것처럼 보이지만, 사실은 튜플 하나를 반환한 것이다. Python에서 튜플을 생성하는 것은 쉼표지 괄호가 아니다. 따라서 아래의 결과를 보면 튜플 언팩킹이 가능하다는 것을 알 수 있다.
```bash
>>> a = (1, 2)
>>> a
(1, 2)
>>> b = 1, 2
>>> b
(1, 2)
>>> x = function()
>>> x
(1, 2, 3)
```

<br>

위 내용은 *Python Cookbook, 3rd edition, by David Beazley and Brian K. Jones (O'Reilly)* 를 참고하여 정리함.