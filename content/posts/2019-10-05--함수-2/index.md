---
title: 함수 2
subTitle: default 인자를 사용하는 함수 정의
category: "Python"
cover: ../python.png
---

## 기본 인자를 사용하는 함수 정의
함수를 정의할 때 default 인자를 넣어 선택적으로 사용하는 경우가 있다. 아래 예시와 같이 선택적 인자를 사용하는 함수를 정의하기는 쉽다. 단순히 함수 정의부에 값을 할당하기만 하면 된다.
```python
def test(a, b=42):
    print(a, b)

test(1)         # a=1, b=42
test(1, 2)      # a=1, b=2
```
기본 값이 리스트, 세트, 딕셔너리 등 수정 가능한 컨테이너여야 한다면 `None`을 사용해 다음과 같이 작성하면 된다.
```python
# 기본 값으로 리스트 사용
def test(a, b=None):
    if b is None:
        b = []
    ...
```
기본 값을 제공하는 함수 대신 받은 값이 특정 값인지 아닌지 확인하려면 다음 코드를 사용한다.
```python
_no_value = object()

def test(a, b=_no_value):
    if b is _no_value:
        print('b 매개변수가 존재하지 않음!')
    ...

test(1)         # b 매개변수가 존재하지 않음!
test(1, 2)      # b = 2
test(1, None)   # b = None
```
위 코드를 보면 `object()`를 사용하는 것이 일반적이지 않아 보인다. **object**는 Python에서 거의 모든 객체의 베이스 클래스 역할을 한다. **object**의 인스턴스를 만들수는 있지만, 여기에서 어떤 메소드나 인스턴스 데이터가 없어서 그대로 사용하지는 않는다. 이것을 가지고는 동일성을 확인하는 것 외에는 할 수 있는것이 없기때문에 이처럼 특별 값을 만들 때 유용하다.

위와 같이 아무런 값을 전달하지 않았을 때와 `None` 값을 전달했을 때의 차이점에 주목해야 한다.

첫번째로, 할당하는 기본 값은 함수를 정의할 때 한 번만 정해지고 그 이후에는 변하지 않는다.
```bash
>>> x = 42
>>> def test(a, b=x):
...     print(a, b)
...
>>> test(1)
1 42
>>> x = 23      # 효과 없음
>>> test(1)
1 42
>>>
```
Python에서 함수의 기본값은 **함수가 정의될때 한번** 정해지고 다시는 바뀌지 않는다. 따라서 위 예제와 같이 변수 x의 값을 바꾸어도 그 이후에 기본 값이 변하지 않는다.

두번째로, 기본 값으로 사용하는 값은 `None`, `True`, `False`, 숫자, 문자열 같이 항상 변하지 않는 객체를 사용해야 한다. 소스 코드상의 문제는 없을 수 있지만 중간에 값이 바뀌어버려 예상하지 못한 결과가 나올 수 있다. 특히 다음과 같은 코드는 절대 사용하면 안된다.
```python
def test(a, b=[]):
    ...
```
이렇게 하면 기본 값이 함수를 벗어나서 수정되는 순간 많은 문제가 발생한다. 값이 변하면 기본 값이 변하게 되고 추후 함수 호출에 영향을 준다.
```bash
>>> def test(a, b=[]):
...     print(b)
...     return b
...
>>> x = test(1)
>>> x
[]
>>> x.append(99)
>>> x.append('hello')
>>> x
[99, 'hello']
>>> test(1)         # 수정된 리스트가 반환된다!
[99, 'hello']
>>>
```
이러한 부작용을 방지하기 위해 위 예제에서와 같이 기본 값으로 `None`을 할당하고 함수 내부에서 이를 확인하는 것이 좋다.
또한, `None`을 확인할 때 `is` 연산자를 사용하는 것이 매우 중요하다. 많은 사람들이 아래와 같은 실수를 범하고는 한다.
```python
def test(a, b=None):
    if not b:
        b = []
```
Python에서는 `길이가 0인 문자열, 리스트, 튜플 딕셔너리` 등 `None`과 마찬가지로 `False`로 평가한다. 따라서 특정 입력을 없다고 판단할 수 있다.
```python
def test(a, b=None):
    if not b:
        print(f'b is {b}')
    else:
        print('yes')

test(1)         # b is None
test(1, [])     # b is []
test(1, 0)      # b is 0
test(1, '')     # b is
```
이번 주제는 어떻게 보면 사소한 것이지만, 전혀 예상하지 않은 사소한 실수로 인해 Debugging에 곤란을 겪을 수 있다.

<br>

위 내용은 *Python Cookbook, 3rd edition, by David Beazley and Brian K. Jones (O'Reilly)* 를 참고하여 정리함.