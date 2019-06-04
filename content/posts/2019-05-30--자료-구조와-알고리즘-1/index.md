---
title: 자료 구조와 알고리즘-1
subTitle: 시퀀스를 개별 변수로 나누기
category: "Python"
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
<br>

## 임의 순환체의 요소 나누기
파이썬에서 언팩킹은 iterator의 요소들을 나눌때 편리하게 쓸수 있지만 요소가 많아지게 되면 사용하기가 힘들어진다. 이때에는 `*` 를 사용하면 된다.
```python
record = ('Dylan', 'example@email.com', '010-1234-5678', '02-111-2222')
name, email, *numbers = record
print(name)     # Dylan
print(numbers)  # ['010-1234-5678', '02-111-2222']
```
또한 별표 구문은 길이가 일정하지 않은 튜플에 사용하면 상당히 편리하다.
```python
# Example 1

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


# Example 2

line = 'nobody:*:-2:-2:Unprivilieged User:/var/empty:/usr/bin/false'
uname, *fields, homedir, sh = line.split(':')
print(uname)        # nobody
print(homedir)      # /var/empty
print(sh)           # /usr/bin/false
```
<br>

## 마지막 N개 아이템 유지
순환이나 프로세싱 중 마지막으로 발견한 N개의 아이템을 유지하고 싶다면 `collections` 모듈의 `deque`를 쓰면 좋다.
`deque(maxlen=N)`으로 고정 크기 큐를 생성한다. 큐가 꽉찬 상태에서 새로운 아이템을 넣으면 가장 마지막 아이템이 자동으로 삭제된다.
```bash
>>> from collections import deque
>>> q = deque(maxlen=3)
>>> q.append(1)
>>> q.append(2)
>>> q.append(3)
>>> q
deque([1, 2, 3], maxlen=3)
>>> q.append(4)
>>> q
deque([2, 3, 4], maxlen=3)
>>> q.append(5)
>>> q
deque([3, 4, 5], maxlen=3)
```
위 작업은 리스트를 사용하여 수동으로 처리할 수 있지만, 큐를 사용하는 것이 더 빠리고 보기 좋다. 조금 더 일반적으로 큐 구조체가 필요할 때 deque를 사용할 수 있다. 최대 크기를 지정하지 않으면 제약 없이 양쪽에 아이템을 넣거나 빼는 작업을 할 수 있다. 물론 최대 크기를 지정하고도 아래 작업을 할 수 있다.
```bash
>>> q = deque()
>>> q.append(1)
>>> q.append(2)
>>> q.append(3)
>>> q
deque([1, 2, 3])
>>> q.appendleft(4)
>>> q
deque([4, 1, 2])
>>> q.pop()
2
>>> q.popleft()
4
```
큐의 양 끝에 아이템을 넣거나 빼는 작업에는 시간복잡도 O(1)이 소요되며, 이는 O(N)이 소요되는 리스트의 작업에 비해 훨씬 빠르다.

<br>


## N 아이템의 최대 혹은 최소값 찾기
컬렉션 내부에서 가장 작은 N개의 아이템을 찾으려고 할때 `heapq` 모듈의 `nlargest`와 `nsmallest`를 사용하면 편하다.
```python
import heapq

# Example 1
nums = [1, 8, 2, 23, 7, -4, 19, 23, 42, 37, 2]
print(heapq.nlargest(3, nums))      # [42, 37, 23]
print(heapq.nsmallest(3, nums))     # [-4, 1, 2]

# Example 2
portfolio = [
    {'name': 'IBM', 'shares': 100, 'price': 91.1},
    {'name': 'AAPL', 'shares': 50, 'price': 543.22},
    {'name': 'FB', 'shares': 200, 'price': 21.09},
    {'name': 'HPQ', 'shares': 35, 'price': 31.75},
    {'name': 'YHOO', 'shares': 45, 'price': 16.35},
    {'name': 'ACME', 'shares': 75, 'price': 115.65}
]
cheap = heapq.nlargest(3, portfolio, key=lambda x: x['price'])
cheap = heapq.nsmallest(3, portfolio, key=lambda x: x['price'])
```
가장 작거나 큰 N개의 아이템을 찾고 있고, N이 컬렉션 전체 크기보다 작다면 `heapq`는 아주 좋은 성능을 보여준다. `heapq` 모듈을 이진 트리(binary tree) 기반으로 구현되어 O(log N)의 시간복잡도가 소요된다. `heapq`의 가장 중요한 기능 한가지를 보면 다음과 같다.
```bash
>>> nums = [1, 8, 2, 23, 7, -4, 18, 23, 42, 37, 2]
>>> import heapq
>>> heapq.heapify(nums)
>>> nums
[-4, 2, 1, 23, 7, 2, 18, 23, 42, 37, 8]
```
힙의 가장 중요한 기능은 첫번째 인덱스가 가장 작은 아이템이 된다는 것이다.
```bash
>>> heapq.heappop(nums)
-4
>>> heapq.heappop(nums)
1
>>> heapq.heappop(nums)
2
```
`nlargest`와 `nsmallest`는 찾고자 하는 아이템의 갯수가 상대적으로 적을 때 좋은 성능을 보이며, 만약 최솟값이나 최댓값을 찾고자 한다면 `min`, `max`를 사용하는 것이 좋다.
그리고 N의 크기가 컬렉션의 크기와 비슷해지면 우선 컬렉션을 정렬해 놓고 슬라이싱하는 것이 더 빠르다(sorted(items[:N]) 또는 sorted(items[-N:])).
<br>

위 내용은 *Python Cookbook, 3rd edition, by David Beazley and Brian K. Jones (O'Reilly)* 를 참고하여 정리함.
