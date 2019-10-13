---
title: 이터레이터와 제너레이터 1
subTitle: 이터레이터 만들기
category: "Python"
cover: ../python.png
---

객체 순환(iteration)은 파이썬의 강력한 기능 중 하나이다. 순환을 단순히 시퀀스 내부 아이템에 접근하는 방법으로 생각할 수도 있지만, 순환을 통해 순환 객체 만들기, itertools 모듈의 순환 패턴 적용하기, 제너레이터(generater) 함수 만들기 등 여러가지를 할 수 있다.

## 수동으로 이터레이터 소비
파이썬의 for문은 순환 가능한 객체를 자동으로 순환하게 도와준다. 하지만 이를 수동으로 접근하여 제어할 수도 있다.
아래의 예는 `next()` 함수를 사용하고 `StopIteration` 예외 처리를 통해 파일을 읽어오는 코드이다.
```python
with open('/etc/passwd/') as f:
    try:
        while 1:
            line = next(f)
            print(line, end=' ')
    except StopIteration:
        pass
```
일반적으로 `StopIteration`은 순환의 끝을 알리는데 사용되지만, `next()`를 수동으로 사용하면 `None`과 같은 종료 값을 반환하는 데 사용할 수도 있다.
```python
with open('/etc/passwd/') as f:
    while 1:
        line = next(f, None)
        if line is None:
            break
        print(line, end=' ')
```
대개의 경우, for문을 사용하여 쉽게 순환패턴은 구현할 수 있지만 커스텀 이터레이션을 구현하기 위해서는 기저에 어떤 동작이 일어나는지 정확히 알아둘 필요가 있다.
```bash
>>> items = [1, 2, 3]       # 이터레이터 생성
>>> it = iter(items)        # items.__iter__() 실행, 이터레이터 실행
>>> next(it)                # it.__next__() 실행
1
>>> next(it)
2
>>> next(it)
3
>>> next(it)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration
>>> 
```

<br>

## 델리게이팅 순환




<br>

위 내용은 *Python Cookbook, 3rd edition, by David Beazley and Brian K. Jones (O'Reilly)* 를 참고하여 정리함.