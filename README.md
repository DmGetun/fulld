# TODO:
## Изучить сереализаторы и понять, правильно ли они реализованы
## Добавить отображение опросов, созданных пользователем
## Переписать css на sass

### Документация API
### Чтобы получить токен пользователя:
* Request method: POST
* URL: http://localhost:8000/user/token/
* Body: 
    * username: 
    * password: 
* Example:
```
curl --location --request POST 'http://localhost:8000/user/token' \
--form 'username=%username' \
--form 'password=%password'
```

### Чтобы обновить токен пользователя:
* Request method: POST
* URL: http://localhost:8000/user/token/refresh
* Body: 
    * refresh: 
* Example:
```
curl --location --request POST 'http://localhost:8000/user/token/refresh' \
--form 'refresh=%refresh' \
```

### Получить опросы, созданные пользователем:
* Request method: POST
* URL: http://127.0.0.1:8000/polls
* Body: 
    * username: 
* Example:
```
curl --location --request POST 'http://localhost:8000/user/token/refresh' \
--form 'username=%username' \
```



