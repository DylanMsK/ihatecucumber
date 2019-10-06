---
title: 함수 3
subTitle: 이름 없는 함수 lambda
category: "Python"
cover: ../python.png
---

## 이름 없는 함수 lambda 정의
`sort()`, `max()` 등에 사용할 콜백 함수를 만들때 많은 사람들이 **lambda**를 사용해 인라인 함수를 사용한다.
```bash
>>> add = lambda x, y: x + y
>>> add(2, 3)
5
>>> add('Hello', 'World')
'HelloWorld'
>>>
```
```bash
>>> def add(x, y):
...     return x + y
...
>>> add(2, 3)
5
>>>
```
위 두 예제는 완전히 동일한 결과를 반환한다.
일반적으로 **lambda**는 정렬이나 데이터 줄이기 등 다른 작업에 사용할 때 많을 쓴다.

```bash
>>> names = ['David Beazley', 'Brian Jones', 'Raymond Hetttinger', 'Ned Batchelder']
>>> sorted(names, key=lambda name: name.split()[-1].lower())
['Ned Batchelder', 'David Beazley', 'Raymond Hetttinger', 'Brian Jones']
>>>
```

lambda는 간단한 함수를 정의할 때 코드의 양을 확실히 줄여주는 효과가 있지만 제약이 아주 많다. 우선 표현식을 하나만 사용해야 하고 그 결과가 반환 값이 된다. 따라서 명령문을 여러 개 쓴다거나 조건문, 순환문, 에러 처리 등을 넣을 수는 없다.

<br>

## lmabda 함수에서 변수 고정
함수에 사용되는 변수를 고정할 때 `lambda`와 `def`는 조금 다르게 동작한다.
```bash
>>> x = 10
>>> a = lambda y: x + y
>>> x = 20
>>> b = lambda y: x + y
>>>
```
위 예제를 보자. a(10), b(10)을 출력해 보면 20, 30이 나올것으로 예상할 수 있다. 하지만 `lambda`에서 사용한 x값은 실핼 시간에 달라지는 변수다. 따라서 lambda 표현식의 x의 값은 그 함수를 실행할 때의 값이 된다.
```bash
>>> a(10)
30
>>> b(10)
30
>>> x = 15
>>> a(10)
25
>>> x = 3
>>> a(10)
13
>>>
```
따라서 lambda를 정의할 때 특정 값을 고정하고 싶으면 그 값을 기본 값으로 지정하면 된다.
```bash
>>> x = 10
>>> a = lambda y, x=x: x + y
>>> x = 20
>>> b = lambda y, x=x: x + y
>>> a(10)
20
>>> b(10)
30
>>>
```

위 예제를 적용해 리스트 내포(list comprehension)를 생성해 보면 아래와 같은 실수를 방지할 수 있다.
```bash
>>> funcs = [lambda x: x+n for n in range(5)]
>>> for f in funcs:
...     print(f(0))
...
4
4
4
4
4
>>>
```
```bash
>>> funcs = [lambda x, n=n: x+n for n in range(5)]
>>> for f in funcs:
...     print(f(0))
...
0
1
2
3
4
>>>
```
리스트 내포나 반복문 등에서 lambda 표현식을 생성하고 lambda 변수가 순환 변수를 기억하게 하고 싶다면 함수를 정의하는 시점의 값을 고정해 놓고 사용하면 된다.

<br>

위 내용은 *Python Cookbook, 3rd edition, by David Beazley and Brian K. Jones (O'Reilly)* 를 참고하여 정리함.