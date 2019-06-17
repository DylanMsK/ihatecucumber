---
title: Django를 이용한 REST API 만들기
subTitle: Django rest framework 사용하기
category: "Django"
cover: ../django.png
---

## Django REST Framework (DRF)
REST API의 가장 큰 장점중에 하나는 프론트와 백엔드를 완전하게 분리할 수 있다는 것이다. 기존의 일반적인 웹서버는 프론트로부터 정보를 받고 POST 형식으로 데이터를 전달해야해서 웹서버 하나에서 사용자의 트래픽과 데이터 처리를 동시에 해야했다. 하지만 REST API를 이용하면 위 작업을 나누어 웹서버의 용량을 효율적으로 쓸 수 있다. REST API를 만드는 작업은 `Django Rest Framework(DRF)`를 사용하여 간단하게(?) 개발할 수 있다.

처음에는 새로운 API 서버를 만들어야 하는 과정이 귀찮을 수 있다. 하지만, 과정을 겪고나면 프로트엔드와 백엔드의 분리로 더 명시적이고 가독성 높은 코드를 짤 수 있다.

<br>

### `djangorestframework` 초기 설정
먼저 pip을 통해 `djangorestframework`를 설치한다. 설치가 끝나면 settings.py의 INSTALLED_APPS에 앱을 추가해준다.
```python
# settings.py

...

INSTALLED_APP = [
    ...
    'rest_framework',
    'myapp',
    ...
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        # 'rest_framework.permissions.IsAdminUser',
    ],
    'PAGE_SIZE': 10
}

...
```
`rest_framework` 앱을 등록한 후 REST_FRAMEWORK 를 선언해 pagination과 권한 설정 등 다양한 기능을 추가할 수도 있다. 위 코드에서 주석은 admin 사용자만 접근 가능하다는 뜻이다.

<br>

### DB 모델링
`title` 과 `director` 필드를 가진 `Movie` 라는 sample model을 정의했다.
```python
# myapp/models.py
from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length = 100)
    director = models.CharField(max_lengh = 100)
```

<br>

### Serializers.py 생성
serializer란 models 객체와 querysets 같은 복잡한 데이터를 JSON, XML 등의 native 데이터로 변환시켜준다. 또한 POST로 넘겨받은 데이터의 유효성(validation)을 검사하여 db에 저장하거나, python이 제공하는 데이터 형식으로 형변환할 수 있다. REST framwork의 serializer는 django의 ModelForm 클래스와 아주 유사하게 동작한다.
```python
# myapp/serializers.py
from myapp.models import Movie
from rest_framwork import serializers

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__' # ('title', 'director',)과 같은 의미
```

<br>

### Views
```python
# myapp/views.py
from serializers import MovieSerializer
from myapp.models import Movie

def movies(request):
    queryset = Movie.objects.all()
    serializer = MovieSerializer()

```


### URL 연결
```python
# myapp/urls.py
from django.urls import path
from myapp import views

urlpatterns = [
    path(r'^', views.movies),
]

```