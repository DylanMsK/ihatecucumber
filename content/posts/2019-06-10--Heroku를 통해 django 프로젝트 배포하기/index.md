---
title: Heroku를 통해 django 프로젝트 배포하기
subTitle: Heroku에 프로젝트 배포
category: "Django"
cover: ../django.png
---
간단한 학습용으로 Django 프로젝트를 배포할 수 있는 서비스를 제공하는 웹 호스팅 업체는 아주 많다. 일반적으로 알려진 django가 잘 동작한다고 알려진 호스팅업체[[링크](http://djangofriendly.com/hosts/)]들 중에서 대표적으로 AWS, Azure, Heroku, Pythonanywhere, DigitalOcean 등이 있다. 이번 포스트에서는 사용하기 쉬우면서도 무료인 **Heroku**를 통한 프로젝트 배포에 대해서 정리해 보았다.

<br>

### 웹사이트에 올리기 프로젝트 코드 수정
현재 우리가 작업한 프로젝트는 개발환경에 최적화 되어있다. 그렇기 때문에 그대로 배포하게되면 보안이나 성능상의 이슈가 발생한다. 실제 상업적 목적을 가진 서비스를 배포할 경우에는 많은 것을 수정해야 하지만 지금은 학습을 위한 배포이기 때문에 가장 중요한 부분만 수정한다. 

**settings.py**
```python
...

# SECRET_KEY = 'f4uw#0u34i#c-a-3*=al#%%js2a86f^phrp-)3y9jl_3g85)mp'
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'f4uw#0u34i#c-a-3*=al#%%js2a86f^phrp-)3y9jl_3g85)mp')

# DEBUG = True
DEBUG = bool( os.environ.get('DJANGO_DEBUG', True) )

...
```
- `DEBUG`

    DEBUG 변수는 개발중 발생하는 모든 오류 메세지를 화면에 띄어준다. 개발중에는 이 기능을 통해 디버깅이 원활했지만 배포시에는 이 기능을 꺼야한다. 이 기능이 켜져있는 상태에서 배포된다면, 우리 서비스를 사용하는 모든 유저들이 request/response 정보뿐 만 아니라 프로덕트 전반을 알 수 있게된다.

- `SECRET_KEY`

    이 변수는 CRSF 보안 등을 위해 사용되는 큰 숫자의 랜덤값이다. 이 정보가 노출되면 서버가 비밀리에 간직해야되는 모든 정보의 암호화가 무용지물이 된다.

실제 서비스 배포시 보안과 성능을 위해서는 수정해야 할 코드가 많은데 추가적인 작업에 대해서 알아보려면 django 공식 문서[[링크](https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/)]를 참고하면 된다.

<br>

### Heroku에 배포 전 환경설정
Django는 Heroku에 프로젝트를 배포하기 쉽게 해주는 `django-heroku`라는 라이브러리를 제공한다. bash창에 `pip install django-heroku` 명령어를 통해 패키지를 설치한 후 프로젝트에 위 모듈을 추가해 준다.

**django-heroku 설치**
```python
# settings.py
import django_heroku

...

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
django_heroku.settings(locals()) # app의 local 설정을 가져가겠다
```
django-heroku는 heroku에 배포하기 위해 사용하는 여러가지 모듈을 포함하고 있어 추가적인 패키치를 설치할 필요가 없다. 이를 확인하기 위해 `pip list` 명령어를 입력해서 "whitenoise, psycopg2, django-heroku"가 설치되어있는지 확인한다.

<br>

**Procfile 파일 생성**

프로젝트 폴더 안(manage.py와 같은 경로)에 `Procfile` 파일을 확장자 없이 만든 후 아래 내용을 작성한다. 꺽쇠 안에는 해당 프로젝트의 이름을 작성한다. 정확한 프로젝트 이름을 알기 위해서는 프로젝트앱 내부에 있는 wsgi.py에서 복사해온다.
```
web: gunicorn <프로젝트 명>.wsgi --log-file -
```

<br>

**Gunicorn 설치**

`pip install gunicorn` 명령어를 통해 gunicorn 패키지를 설치한다.

<br>

**runtime.txt 파일 생성**

Django 프로젝트를 실행시킬 Heroku 서버에 Python 버전을 알려준다. Procfile과 찬가지로 최상위 폴더에 `runtime.txt`를 만들고 아래 텍스트를 작성한다.
```
python-<python version>
```
django의 버전이 계속 업그레이드 되고 있지만(2019.06.10 기준 django==2.2.0) 안정도가 높은 python(3.6.7 버전)과 가장 우수한 호환성을 보이는 django는 2.1.7 버전이다. 자신이 필요로하는 새로운 기능이 추가되지 않는 이상 python 은 3.6.7, django는 2.1.7 버전을 사용하는게 좋다.

<br>

**requirements.txt 파일 생성**

Heroku에 프로젝트를 배포하기 위한 마지막 작업이다. python 프로젝트가 돌아갈 Heroku 서버에 python 패키지들을 설치해 줘야 한다. 일일이 패키지들을 설치해줄 수도 있지만 설치된 패키지 목록을 넘겨 한번에 설치할 수도 있다. bash에 `pip freeze > requirements.txt` 명령어를 입력해 패키지 목록을 박제한다.

<br>

### Heroku에 배포하기

