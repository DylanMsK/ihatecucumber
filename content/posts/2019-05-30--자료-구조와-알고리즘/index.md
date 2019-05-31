---
title: 자료 구조와 알고리즘-1
subTitle: 시퀀스를 개별 변수로 나누기
category: "python"
cover: ../python.png
---

파이썬은 `list`, `set`, `dictionary` 와 같은 자료 구조를 내장하고 있다. 이러한 구조체의 장점은 사용이 편리하다는 점이다. 하지만 검색, 정렬, 순서, 여과 등에 대한 작업에 종종 어려움이 생긴다.

예를들어 N개의 요소를 가진 튜플이나 시퀀스가 있을때 이를 변수 N개로 나누려고 한다. 모든 시퀀스(혹은 iterating이 가능한 것)는 간단한 할당문을 사용해 개별 변수로 나눌 수 있다.

```python
p = (4, 5)
x, y = p
print(x)        # 4
print(y)        # 5

data = ['Dylan', 28, 70.8, (1992, 12, 7)]
name, age, weight, date = data
print(name)     # Dylan
print(date)     # (1992, 12, 7)

name, age, weight, (year, month, day) = data
print(year)     # 1992
print(month)    # 12

string = 'Python'
a, b, c, d, e, f = string
print(a)        # 'P'
print(f)        # 'n'
```
언팩킹은 튜플이나 리스트뿐만 아니라 모든 iterator 객체에 적용할 수 있다. 여기서 모든 요소를 언팩킹할 필요가 없을 경우에는 단순히 버릴 변수명을 지정할 수 있다.
```python
data = ['Dylan', 28, 70.8, (1992, 12, 7)]
_, age, weight, _ = data
print(age)      # 28
print(weight)   # 70.8
```

하지만 요소의 개수가 일치하지 않으면 다음과 같은 에러가 발생한다.
```bash
>>> p = (4, 5)
>>> x, y, z = p
Traceback (most recent call last):
    File "<stdin>", line 1, in <module>
ValueError: need more than values to unpack
```

파이썬에서 언팩킹은 iterator의 요소들을 나눌때 편리하게 쓸수 있지만 요소가 많아지게 되면 사용하기가 힘들어진다. 이때에는 `*` 를 사용하면 된다.
```python
record = ('Dylan', 'example@email.com', '010-1234-5678', '02-111-2222')
name, email, *numbers = record
print(name)     # Dylan
print(numbers)  # ['010-1234-5678', '02-111-2222']
```
또한 별표 구문은 길이가 일정하지 않은 튜플에 사용하면 상당히 편리하다.
```python
records = [
    ('foo', 1, 2),
    ('bar', 'hello'),
    ('foo', 3, 4),
]

def do_foo(x, y):
    return print('foo', x, y)

def do_bar(s):
    return print('bar', s)

for tag, *args in records:
    if tag =='foo':
        do_foo(*args)
    elif tag == 'bar':
        do_bar(*args)
```