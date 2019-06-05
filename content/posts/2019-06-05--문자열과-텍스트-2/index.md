---
title: 문자열과 텍스트-2
subTitle: 텍스트 검색
category: "Python"
cover: ../python.png
---
파이썬의 `str.find()`, `str.startswith()`, `str.endswith()` 같은 메소드를 사용하면 간단하게 텍스트 매칭이 가능하다. 하지만 조금만 복잡한 매칭을 하려면 위 메소드들로는 힘들어진다. 예를 들어 "6/5/2019" 형식의 날짜나 이메일 포맷에서 원하는 텍스트를 뽑으려면 위 메소드들로는 까다롭다. 이러한 문제는 정규 표현식과 `re` 모듈을 사용하여 쉽게 해결할 수 있다. 아래의 예제를 보면,
```
>>> date1 = '6/5/2019'
>>> date2 = 'Jun 5, 2019'
>>> import re
>>> if re.match(r'\d+/\d+/\d+', date1):
        print('yes')
    else:
        print('no')
yes
>>> if re.match(r'\d+/\d+/\d+', date2):
        print('yes')
    else:
        print('no')
no
>>>
```
위 코드에서는 동일한 패턴으로 같은 작업을 반복 하였는데, 이럴 경우 사용하고자 하는 정규 표현식을 미리 컴파일해서 패턴 객체로 만들어 놓으면 편하다.
```
>>> dateformat = re.compile(r'\d+/\d+/\d+')
>>> if dateformat.match(date1):
        print('yes')
    else:
        print('no')
yes
>>> if dateformat.match(date2):
        print('yes')
    else:
        print('no')
no
>>>
```
`match()`는 항상 문자열에서 처음 매칭되는 패턴을 리턴하는데, 텍스트 전체에 걸쳐 여러 패턴을 찾으려면 `findall()` 메소드를 사용하면 된다.
```
text = 'Today is 6/5/2019. Pycon starts 8/15/2019.'
>>> dateformat.findall(text)
['6/5/2019', '8/15/2019']
```
위 방법도 좋지만 일반적으로 정규 표현식을 사용할때에 괄호를 사용해 캡처 그룹을 만드는 것이 일반적이다. 캡처 그룹을 사용하면 매칭된 텍스트에 작업할 때 각 그룹을 개별적으로 추출할 수 있어 편리하다.
```
>>> dateformat = re.compile(r'(\d+)/(\d+)/(\d+)')
>>> m = dateformat.match('6/5/2019')
>>> m
<re.Match object; span=(0, 8), match='6/5/2019'>
>>> m.group(0)
'6/5/2019'
>>> m.group(1)
'6'
>>> m.group(2)
'5'
>>> m.group(3)
'2019'
>>> m.groups()
('6', '5', '2019')
>>>
>>> # 전체 매칭 찾기
>>> text = 'Today is 6/5/2019. Pycon starts 8/15/2019.'
>>> dateformat.findall(text)
[('6', '5', '2019'), ('8', '15', '2019')]
>>> for month, day, year in dateformat
dateformat
>>> for month, day, year in dateformat.findall(text):
...     print('{}-{}-{}'.format(year, month, day))
... 
2019-6-5
2019-8-15
```
`findall()` 메소드는 텍스트를 검색하고 모든 매칭을 찾아 리스트로 반환하는데, 한 번에 결과를 얻지 않고 텍스트를 순환하며 찾으려면 `finditer()`를 사용하면 된다.
```
>>> for m in dateformat.finditer(text):
...     print(m.groups())
... 
('6', '5', '2019')
('8', '15', '2019')
>>>
```
간단한 텍스트 매칭/검색을 수행하려 한다면 컴파일 과정을 생략하고 re 모듈의 레벨 함수를 바로 사용해도 괜찮다.
```
>>> re.findall(r'(\d+)/(\d+)/(\d+)', text)
[('6', '5', '2019'), ('8', '15', '2019')]
>>>
```
모듈 레벨 함수는 최근에 컴파일한 패턴을 기억하기 때문에 성능에 있어 큰 차이를 보이지는 않지만, 패턴을 미리 컴파일하면 예측하지 못한 추가적인 작업을 줄일 수 있고, 코드의 가독성을 높일 수 있어 효율적이다.

<br>


### 텍스트 검색과 치환
위 예제에서 "6/5/2019" 형식의 날짜 포맷에서 "2019-6-5" 형식의 날짜 포맷으로 바꾸기 위해 for문을 사용했다. 파이썬이 제공하는 `re` 모듈의 `sub()` 메소드를 사용하면 위 작업을 간단히 해결할 수 있다.
```
>>> text = 'Today is 6/5/2019. Pycon starts 8/15/2019.'
>>> re.sub(r'(\d+)/(\d+)/(\d+)', r'\3-\1-\2', text)
'Today is 2019-6-5. Pycon starts 2019-8-15.'
>>> 
```