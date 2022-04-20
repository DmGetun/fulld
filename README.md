# 1. Переделать запросы к API на нормальные
# 2. Переделать ответ API GET на нормальный

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


