---
title: 문자열과 텍스트-3
subTitle: unicode가 포함된 문자열 
category: "Python"
cover: ../python.png
---
가끔 텍스트 파싱이나 데이터 처리시 유니코드가 포함된 문자열을 만날때가 있다. 이때 모든 문자열에 동일한 표현식을 갖도록 보장하고 싶다. 유니코드에서 몇몇 문자는 하나 이상의 유효한 시퀀스 코드 포인트로 표현할 수 있는데 아래의 예제를 보면
```
>>> s1 = 'Spicy Jalape\u00f1o'
>>> s2 = 'Spicy Jalapen\u0303o'
>>> s1
'Spicy Jalapeño'
>>> s2
'Spicy Jalapeño'
>>> s1 == s2
False
>>> len(s1)
14
>>> len(s2)
15
>>> 
```
유니코드를 사용하면 'Spicy Jalapeño' 텍스트를 두가지 이상의 표현식으로 표현할 수 있다. 하지만 여러 표현식을 갖는다는 것은 문자열을 비교하는 프로그램의 측면에서 문제가 된다. 이 문제는 파이썬 내장 모듈인 `unicodedata`로 텍스트를 노멀화(nomalization)해서 표준 표현식으로 변환해주면 된다.
```
>>> import unicodedata
>>> t1 = unicodedata.normalize('NFC', s1)
>>> t2 = unicodedata.normalize('NFC', s2)
>>> t1 == t2
True
>>> t1
'Spicy Jalapeño'
>>> ascii(t1)
"'Spicy Jalape\\xf1o'"
>>> 
>>> t3 = unicodedata.normalize('NFD', s1)
>>> t4 = unicodedata.normalize('NFD', s2)
>>> t3 == t4
True
>>> t3
'Spicy Jalapeño'
>>> ascii(t3)
"'Spicy Jalapen\\u0303o'"
>>>
```
`normalize()`의 첫 번째 인자에는 문자열을 어떻게 노멀화할 것인지를 지정한다. 표준 유니코드 기준은 NFD(분해), NFC(결합), NFKD(호환분해), NFKC(호환결합)가 있는데, 사람이 보기에는 모두 같아 보이지만 bytearray를 확인해 보면 다 다르다. 이해를 위한 간단한 예를 들면, 어떠한 웹 페이지에서 분명 `한글`이라고 입력된 정상적인 텍스트를 복사하여 다른곳에 붙혀넣기 했을때 `ㅎㅏㄴㄱㅡㄹ` 같이 한글 자모가 분리되는 경우가 있다. 한글뿐 아니라 `é`라는 한 문자가  `e`와 `´`로 나뉘어 지는 경우가 있는데, 이와 같은 문제가 다른 표현식의 유니코드를 사용했기 때문에 나타난다. Mac OS를 쓰는 사용자의 경우 위와 같은 문제를 가끔 보게 되는데, MacOS에서는 NFD 방식으로 보여주는 반면 Windows에서는 NFC 방식으로 보여주기 때문이다. 여기서 더 문제는, 직접 타이핑을 하면 MAC에서도 NFC 방식을 사용한다. 즉, 파일명은 NFD이고 웹에서 타이핑해서 한글로 검색하면 NFC니, 보이는 한글은 같아도 bytearray로 보면 다른 데이터이다.

<br>


### 정규 표현식에 유니코드 사용
기본적인 유니코드 처리를 위한 대부분의 기능은 `re` 모듈이 제공한다. 예를들면 모든 숫자를 의미하는 정규 표현식인 `\d`가 유니코드 처리도 함께 해준다.
```
>>> import re
>>> num = re.compile(r'\d+')
>>> # 아스키(ASCII) 숫자
>>> num.match('123')
<re.Match object; span=(0, 3), match='123'>
>>> # 아라비아 숫자
>>> num.match('\u0661\u0662\u0663')
<re.Match object; span=(0, 3), match='١٢٣'>
>>> 
```
하지만 특별한 경우를 주의해야 한다. 예를들면 대소문자를 무시하는 매칭에 대소문자 변환을 합치게 되면 문제가 발생할 수 있다.
```
>>> pat = re.compile('stra\u00dfe', re.IGNORECASE)
>>> s = 'straße'
>>> pat.match(s)                # 일치
<re.Match object; span=(0, 6), match='straße'>
>>> pat.match(s.upper())        # 불일치
>>> s.upper()
'STRASSE'
```
위와 같이 대소문자가 바뀌게 되면 유니코드 표현식 자체가 바뀔 수 있다. 우리는 모든 경우에 대해서 위와 같은 오류를 예상할 수 없기 때문에 정규 표현식과 유니코드를 함께 사용하려면 서드파티(third-party) `regex` 라이브러리를 사용하면 좋다.

<br>


### 유니코드가 포함된 텍스트 정리
웹 페이지를 파싱하거나 데이터 처리를 할때 여러 형식으로 이루어진 텍스트를 가공해야할 때가 있다. 간단한 작업의 경우 단순히 기본적인 문자열 함수 `str.upper()`, `str.lower()`를 사용해서 텍스트를 표준 케이스로 변환하면 된다. 그리고 `str.replace()`나 `re.sub()`를 이용해 치환을 하거나 문자 시퀀스를 바꿀 수도 있다. 또한 `unicodedata.normalize()`를 사용해서 텍스트를 노멀화할 수도 있다. 하지만, 특정 범위의 문자나 발음 구별 구호를 없애려고 할 때는 `str.translate()` 메소드를 사용하면 좋다.
```
>>> s = 'pŷtĥȍņ\fis\tawesome\r\n'
>>> s
'pŷtĥȍņ\x0cis\tawesome\r\n'
>>> remap = {
...     ord('\t'): ' ',
...     ord('\f'): ' ',
...     ord('\r'): None
... }
>>> a = s.translate(remap)
>>> a
'pŷtĥȍņ is awesome\n'
>>> 
```
위 코드에서는 \t와 \f와 같은 공백문은 띄어쓰기 하나로 치환하고, 복귀 코드(carriage return) \r은 삭제한다. 다음은 위 문자열에서 모든 결합문자를 바꾸려고 한다.
```
>>> import unicodedata
>>> import sys
>>> cmb_chrs = dict.fromkeys(c for c in range(sys.maxunicode) if unicodedata.combining(chr(c)))
>>> b = unicodedata.normalize('NFD', a)
>>> b
'pŷtĥȍņ is awesome\n'
>>> b.translate(cmb_chrs)           # NFD 형식으로 노멀화를 한 텍스트 변환
'python is awesome\n'
>>> a.translate(cmb_chrs)           # 노멀화 하지 않은 텍스트 변환
'pŷtĥȍņ is awesome\n'
>>> 
```
위 예제에서 보면 dict.fromkey()를 사용해 딕셔너리가 모든 유니코드 결합 문자를 None으로 매핑하고 있다. 그리고 'NFD' 형식으로 노멀화를 해 원본 텍스트를 개별적인 결합 문자로 나눈다. 분해된 텍스트에서 발음 기호들을 빈 값으로 치환하면 우리가 일반적으로 사용하는 아스키 표현식만 남게 된다.

또 다른 텍스트 정리 기술로 I/O 인코딩, 디코딩 함수가 있다. 이 방식은 텍스트를 우선 정리해 놓고 encode()나 decode()를 실행해섯 잘라내거나 변경한다.
```
>>> a
'pŷtĥȍņ is awesome\n'
>>> b = unicodedata.normalize('NFD', a)
>>> b.encode('ascii', 'ignore').decode('ascii')
'python is awesome\n'
>>> 
```
위 예제는 노멀화 과정은 동일하지만, 개별적인 결합문자로 나눈 후 뒤이은 아스키 인코딩/디코딩으로 그 문자들을 한번에 폐기한다. 물론 이 방법은 아스키 표현식만으로 표현하고자 할 때 사용한다.
<br>
텍스트를 치환하는 방법은 정말 다양하지만 간단한 치환을 하려면 `str.replace()`을 사용하는 것이 성능적으로 가장 우수하다. 동일한 작업을 여러번 반복한다고 해도 이 방식이 우수한 성능을 보인다. `replace()` 메소드를 사용해 이 전에 보인 공백문은 제거하는 예제 코드를 아래와 같이 수정할 수 있다.
```python
def clean_spaces(s):
    s = s.replace('\r', '')
    s = s.replace('\t', ' ')
    s = s.replace('\f', ' ')
    return s
```
직접 실험해 보면 `translate()`나 정규 표현식을 사용하는 것보다 위 방식이 더 빠르다. 반면 `translate()` 메소드는 해시(hash) 방식을 이용하기 때문에 복잡한 문자 리맵핑이나 삭제에 사용하면 아주 빠르다.

<br>

위 내용은 *Python Cookbook, 3rd edition, by David Beazley and Brian K. Jones (O'Reilly)* 를 참고하여 정리함.