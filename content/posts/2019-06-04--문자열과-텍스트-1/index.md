---
title: 문자열과 텍스트-1
subTitle: 다양한 방법으로 문자열 나누기
category: "Python"
cover: ../python.png
---

이번 포스트를 포함한 추후 포스트들은 문자열 나누기, 검색, 빼기, 렉싱, 파싱과 같이 텍스트 처리와 관련있는 일반적인 문제에 초점을 맞춘다. 대부분의 문제는 파이썬에 기본적으로 내장되어있는 함수로 해결할 수 있지만 조금 복잡한 문제를 만나게 되면 정규표현식을 사용하거나 문자열 파서를 사용해야 한다.
<br>


### 여러 구분자로 문자열 나누기
단순히 한 가지의 구분자(또는 공백)로 구분되어있는 문자열이 있을 경우에는 파이썬 내장 함수인 `split`을 사용하면 구분하기 편리하다. 하지만 구분자가 여러개일 경우에는 조금 복잡해진다. 이럴 경우에는 `re` 모듈의 `split` 함수를 사용하면 쉽게 문자열을 나눌 수 있다.
```
>>> line = 'Lorem ipsum; dolor, sit,amet,     consectetur'
>>> import re
>>> re.split(r'[;,\s]\s*', line)
['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur']
```
위 코드에서는 쉼표(,), 세미콜론(;), 공백문자와 뒤이어 나오는 0개 이상의 공백문자 모두를 분리 구문으로 사용했다. 이 패턴이 나올 때마다 매칭된 부분 모두가 구분자 가 된다. 결과는 `string.split()`과 마찬가지로 리스트를 반환한다. 위 방법과는 달리 캡처 그룹(capture group)을 사용하면 구분자도 함께 추출할 수 있다.
```
>>> fields = re.split(r'(;|,|\s)\s*', line)
>>> fields
['Lorem', ' ', 'ipsum', ';', 'dolor', ',', 'sit', ',', 'amet', ',', 'consectetur']
```
위 코드뿐만 아니라 출력문을 재구성하기 위해 구분 문자만 추출해야 할 경우도 있는데, 이럴때에는 아래와 같은 방법을 사용하면 된다.
```
>>> values = fields[::2]
>>> delimiters = fields[1::2] + ['']    # 빈 문자열은 values와 길이를 맞추기 위함
>>> values
['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur']
>>> delimiters
[' ', ';', ',', ',', ',', '']

# 동일한 구분자로 라인을 재구성
>>> ''.join(v+d for v, d in zip(values, delimiters))
'Lorem ipsum;dolor,sit,amet,consectetur'
```
분리 구문을 결과에 포함시키고 싶지 않지만 정규 표현식에 괄호를 사용해야 할 필요가 있다면 논캡처 그룹(noncapture group)을 사용하면 된다.
```
>>> re.split(r'(?:,|;|\s)\s*', line)
['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur']
```
<br>


### 문자열 처음이나 마지막에 텍스트 매칭
문자열의 처음이나  마지막에 파일 확장자, URL scheme 등 특정 텍스트 패턴이 포함되었는지 검사하고 싶다면 `startswith`, `endswith` 함수를 사용하면 된다.
```
>>> filename = 'test.txt'
>>> filename.endswith('.txt')
True
>>> filename.startswith('file:')
False
url = 'http://ihatecucumber.netlify.com'
>>> url.startswith('http:')
True
```
만약 여러개의 선택지를 검사해야 한다면 검사하고 싶은 갑을 튜플에 담아 전달하면 된다.
```
>>> import os
>>> filenames = os.listdir('.')
[ 'Makefile', 'foo.c', 'bar.py', 'spam.c', 'spam.h' ]
>>> [name for name in filenames if name.endswith(('.c', '.h'))]
['foo.c', 'spam.c', 'spam.h']
>>> any(name.endswith('.py') for name in filenames)
True
```
또 다른 예제를 보면
```python
from urllib.request import urlopen

def read_data(name):
    if name.startswith(('http:', 'https:', 'ftp:')):
        return urlopen(name).read()
    else:
        with opne(name) as f:
            return f.read()
```
위와 같이 `startswith`와 `endswith`를 사용한다면 불필요하게 긴 코드를 작성 할 필요 없이 손쉽게 프로그래밍이 가능하다. 정규표현식의 `match`를 사용해도 같은 결과를 얻을 수 있지만 위 함수의 장점은 코드가 간단하고 가독성이 우수하는 것이다. **단 주의할 점은 튜플만을 입력으로 받기 때문에** 선택지를 list나 set로 가지고 있다면 `tuple()`을 사용해서 변환해 주어야 한다.

<br>



### 쉘 와일드카드 패턴으로 문자열 매칭
파이썬이 제공하는 기본 모듈중에 `fnmatch`라는 것이 있다. 이 모듈은 쉘에서 사용하는 것과 동일한 와일드카드 패턴(*.py, Dat[0-9].csv 등)을 통해 텍스트 매칭을 가능하게 한다.
```
>>> from fnmatch import fnmatch, fnmatchcase
>>> fnmatch('foo.txt', '*.txt')
True
>>> fnmatch('foo.txt', '?oo.txt')
True
>>> fnmatch('Dat45.csv', 'Dat[0-9]*')
True
>>> names = ['Dat1.csv', 'Dat2.csv', 'Daf3.csv', 'Dat4.csb']
>>> [name for name in names if fnmatch(name, 'Dat*.csv')]
['Dat1.csv', 'Dat2.csv']
```
일반적으로 fnmatch()는 시스템의 파일 시스템과 동일한 대소문자 구문 규칙을 따른다.
```
>>> # OS X (Mac)
>>> fnmatch('foo.txt', '*.TXT')
False
>>> # Windows
>>> fnmatch('foo.txt', '*.TXT')
True
```
맥 OS의 파일 시스템의 경우 대소문자를 구분하지만 windows는 대소문자를 구분하지 않는다. 대문자에 정확히 일치하는 결과만 찾고자 한다면 `fnmatchcase` 함수를 사용하면 된다.
```
>>> fnmatchcase('foo.txt', '*.TXT')
False
```
정규표현식을 이용해도 위와 같은 결과를 보일 수 있지만, 위 함수를 사용한다면 간단한 코드와 높은 가독성을 보일 수 있다. 따라서 간단한 와일드카드만으로 검사할 수 있는 데이터라면 이 함수를 사용하는 것이 좋다. 위 예제와 같이 파일 이름을 찾는 코드를 실제로 작성해야 한다면 위 함수 대신 `glob` 모듈을 사용하는 것이 좋을 것이다.
<br>

위 내용은 *Python Cookbook, 3rd edition, by David Beazley and Brian K. Jones (O'Reilly)* 를 참고하여 정리함.