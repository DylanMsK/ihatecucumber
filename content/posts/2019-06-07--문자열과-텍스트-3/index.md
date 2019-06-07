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
`normalize()`의 첫 번째 인자에는 문자열을 어떻게 노멀화할 것인지를 지정한다. 표준 유니코드 기준은 NFD(분해), NFC(결합), NFKD(호환분해), NFKC(호환결합)가 있다. 모두 정규 표현식이라 사람이 보기에는 같아 보이지만 bytearray를 확인해 보면 다 다르다. 이해를 위한 간단한 예를 들면, 어떠한 웹 페이지엣서 분명 `한글`이라고 입력된 정상적인 텍스트를 복사하여 다른곳에 붙혀넣기 했을때 `ㅎㅏㄴㄱㅡㄹ`로 분해되는 경우가 있다. 한글뿐 아니라 `é`라는 한 문자가  `e`와 `´`로 나뉘어 지는 경우가 있는데, 이와 같은 문제가 다른 표현식의 유니코드를 사용했기 때문에 나타난다. Mac OS를 쓰는 사용자의 경우 위와 같은 문제를 가끔 보게 되는데, MacOS에서는 NFD 방식으로 보여주는 반면 Windows에서는 NFC 방식으로 보여주기 때문이다. 여기서 더 문제는, 직접 타이핑을 하면 MAC에서도 NFC 방식을 사용한다. 즉, 파일명은 NFD이고 웹에서 타이핑해서 한글로 검색하면 NFC니, 보이는 한글은 같아도 bytearray로 보면 다른 데이터이다.

<br>


### 정규 표현식에 유니코드 사용