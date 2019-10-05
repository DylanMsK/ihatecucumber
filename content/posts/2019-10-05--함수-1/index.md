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
```

<br>

## 함수 인자에 메타데이터 넣기
