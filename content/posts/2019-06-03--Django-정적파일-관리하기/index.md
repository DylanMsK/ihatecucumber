---
title: Django Static 파일 관리하기
subTitle: Static 파일 설정
category: "Django"
cover: ../django.png
---

django는 기본적으로 정적 파일을 처리하기 위해 staticfiles라는 모듈을 제공한다. 여기서 static 파일이란 웹 사이트 구성요소 중 Image, Css, Script 등 **내용이 고정되어 응답을 할 때 병도의 처리 없이 파일 내용을 그대로 보내주면 되는 파일**을 의미한다.

Static 파일들은 웹 어플리케이션을 통하지 않고 웹 서버에서 URI에 따른 파일 내용을 그대로 응답함으로써 직접 처리해 줄 수도 있는데, CDN과 같이 static 파일들만을 모아서 따로 관리하는 전담 서버를 통해 static파일들을 처리하여 웹 서버의 load를 줄일수도 있다.

또한 개발 과정에서 `collectstatic` 모듈을 이용하면 각 어플리케이션별로 분산되어 저장한 static 파일들을 한 데 모아서 통합된 static 디렉토리를 만들 수 있다. 이를 이용하여 완성한 프로젝트를 실제 서버에 올릴 때 별도의 static 디렉토리를 생성해서 웹 서버에서 바로 응답하도록 하거나, 별도의 static 파일 전용 서버를 구축할 때 편리하게 사용할 수 있다.
<br>


#### settings.py

```python
...
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_ROOT = os.path.join(BASE_DIR, '.staticfiles')
```

- **STATIC_URL**

  Django는 기본적으로  `/static/` 경로를 사용하여 정적 파일을 관리하며, 사용자가 다른 URL을 사용하고 싶을 경우에는 이 변수를 수정하면 된다.



- **STATICDILES_DIRS**

  Django에서는 static 파일을 찾는 요청이 들어올 경우 각 웹 어플리케이션 내에 위치한 static 디렉토리들을 순차적으로 검색하며 대산 파일을 찾는다. 만약 여기서 찾지 못한 경우 global에 위치한 static 디렉토리를 찾기 시작하며, 여기서도 찾지 못할 경우 404 Not Found 오류를 반환한다.

  기본적으로 Django 프로젝트를 생성할 때 global static 디렉토리는 지정되어 있지 않기 때문에 위 코드에서 `os.path.join(BASE_DIR, 'static')` 을 추가해 주었다.



- **STATIC_ROOT**

  `collectstatic` 명령어를 통해서 수집되는 static 파일들이 위치하는 곳으로, 위 코드에서는 global path의 `.staticfiles` 라는 숨김 폴더에 모든 정적 파일들을 모으도록 설정하였다.

  쉘에 `python manage.py collectstatic` 명령어를 실행하여 정적 파일들을 모을 수 있다. 다만 이 폴더의 내용물들은 이미 어딘다에 있는 정적 파일들을 복사해온 것이므로, `.gitignore` 에 `.staticfiles` 를 추가하여 버전 컨트롤에서 제외시켜야 한다.
<br>


#### html

```html
{% load static %}

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <!-- Custom stlylesheet -->
  <link rel="stylesheet" type="text/css" href="{% static 'css/style.css' %}">

```

정적 파일을 사용하고자 하는 html 파일 맨 위에 `{% load static %}` 코드를 추가하여 정적 파일을 load한다. 해당 html 파일에서는 `{% static %}` 템플릿 태그를 이용해 정적 파일의 절대 URL을 생성해 주고, 불러오고자 하는 파일의 경로를 추가해주면 css, javascript, jpg 등 정적 파일을 자유롭게 불러올 수 있다.
<br>




### Errors

- **`DEBUG=False` 시 static 파일을 못불러올 때**

  로컬에서 테스트를 할 때 DEBUG=False로 놓고 테스트를 진행하는데 static 파일을 못 불러오는 상황이 있다. Django 공식문서에 따르면 [[링크](https://docs.djangoproject.com/en/1.10/howto/static-files/#serving-static-files-during-development)] 프로젝트의 `urls.py` 에 아래의 코드를 추가해 주면 된다.

  - 방법 1

    ```python
    from django.conf import settings
    from django.conf.urls.static import static
    
    urlpatterns = [
       path('admin/', admin.site.urls),
       ...
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    ```

  

  - 방법 2

    ```python
    from django.contrib.staticfiles.views import serve
    
    urlpatterns = [
        path('admin/', admin.site.urls),
        path(r'^static/(?P<path>.*)', serve, kwargs={'insecure': True}),
    		...
    ]
    ```

    