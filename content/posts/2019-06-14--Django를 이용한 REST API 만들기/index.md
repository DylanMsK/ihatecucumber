---
title: Django를 이용한 REST API 만들기
subTitle: Django rest framework 사용하기
category: "Django"
cover: ../django.png
---

## Django REST Framework (DRF)
프론트 개발자와 협력하여 프로젝트를 진행하다 보면 REST API의 필요성을 느끼는 순간이 분명 온다. 가령, 프론트 개발자가 React JS를 쓰려고 한다면 정보 송수신을 어떻게 할 것인가? 프론트로부터 정보를 받고 데이터베이스에 저장하는 것은 기존의 방법으로 할 수 있겠지만 정보를 전달하려면 REST API를 써야 한다. 이때는 Django Rest Framework(DRF)를 사용하여 코드를 작성해야 한다.

처음에는 이 과정이 귀찮을 수 있다. 사실 기존에 있던 코드를 탈바꿈하는 것을 누가 반기겠는가? 하지만, 현재 그 과정을 겪고 REST API를 사용하여 프로젝트를 진행하고 있는 일인으로서 귀찮음에 대한 대가는 충분히 크다고 말하고 싶다.

REST API를 활용하지 않는다면 프론트와 백엔드의 완전한 분리가 불가능하다. Django를 통해 백엔드를 개발하고 있는 사람은 이 말의 뜻을 이해할 것이다. 예를 한 번 보자.