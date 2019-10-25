---
title: Postgresql DB 생성 및 삭제
subTitle: 
category: "Python"
cover: ../python.png
---

AWS EC2 Utuntu 서버에서 Django 프로젝트를 진행할 때 기본 SQLite DB를 Postgres로 바꾸는데는 아래와 같은 작업을 해 주면 된다.
먼저 처음 서버를 켰을때 기본 Linux 환경 설정을 해주기 위해 아래 명령어를 입력한다.
```bash
$ sudo apt-get update && sudo apt-get -y upgrade
```

기본 설정이 끝났으면 `Postgressql`을 설치한다.

```bash
$ sudo apt-get install postgresql postgresql-contrib​
```

위 명령어를 통해 설치를 완료했다면 PostgreSQL은 초기화 되었지만, localhost와만 통신이 가능하다. 추가적인 옵션을 사용하기 위해서는 PostgreSQL configuration을 수정해 주어야 한다.
먼저 아래의 명령어를 통해 default user의 패스워드를 지정해 준다.

```
$ sudo -u postgres psql
postgres=#\password​
```

추가적인 설정은 아래의 링크를 참고한다.<br>
[PostgreSQL on EC2 (Ubuntu) in AWS](https://www.shubhamdipt.com/blog/postgresql-on-ec2-ubuntu-in-aws/)<br>
[Install and Setup PostgreSQL on Ubuntu, Amazon EC2](https://medium.com/@praveenkumarpalai/install-and-setuppostgresql-on-ubuntu-amazon-ec2-5d1af79b4fca)


## DATABASE 생성
#### Mac 
```
CREATE DATABASE knock
WITH
TEMPLATE="template0"
ENCODING="UTF8"
LC_COLLATE="ko_KR.UTF-8"
LC_CTYPE="ko_KR.UTF-8";
```

#### Ubuntu
```bash

```



## DATABASE 삭제
```
DROP DATABASE template_postgis;
```

만약 위 명령어 입력시 `ERROR:  cannot drop a template database` 와 같은 에러가 뜬다면 아래와 같이 DB설정을 바꿔준 후 삭제한다.

```bash
UPDATE pg_database SET datistemplate='false' WHERE datname='template_postgis';
DROP DATABASE template_postgis;
```

## django 프로젝트에 postgis 적용
```
$ sudo apt install gdal-bin python-gdal python3-gdal
$ sudo apt-get install postgis
$ sudo -u postgres psql
postgres=# CREATE EXTENSION postgis;
```