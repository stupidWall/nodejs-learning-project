
# Start

```shell
# 1
npm install

# 2
npm run start
```

# Access interface

- Use `Postman`
- It is recommended to use VSCode's extension plug-in `Thunder Client`


# API

- Based on RESTful API interface specification
- Interface basic request address: `/api/v1`

## Create User

path: `/user`

method:`post` 

| FieldName   | FieldType | IsRequired |
| -------- | -------- | -------- |
| login | string   | Yes       |
| password    | string   | Yes       |
| age    | number   | Yes      |

Request demo:

```json
{
  "login": "bode",
  "password": "12345Hn&",
  "age": 12
}
```

Response demo：

```json
// success
{
  "code": 0,
  "message": "insert ok",
  "data": {
    "userid": "b2ebc63f-cf59-452f-9717-a5dbe79d5e8d"
  }
}
```

## Get User

path: `/users/:userid`

method:`get` 

| FieldName   | FieldType | IsRequired |
| -------- | -------- | -------- |
| userid | string   | Yes       |

Request demo:

```http
http://localhost:3000/api/v1/users/1
```

Response demo：

```json
// success
{
  "code": 0,
  "message": null,
  "data": {
    "id": "1",
    "login": "jack-1",
    "password": "123",
    "age": 12,
    "isDeleted": false
  }
}
```

## Get Users

path: `/users`

method:`get` 

| FieldName   | FieldType | IsRequired |
| -------- | -------- | -------- |
| limit | number   | No       |
| loginSubstring | string   | No       |

Request demo:

```http
http://localhost:3000/api/v1/users?limit=2&loginSubstring=-4
```

Response demo：

```json
// success
{
  "code": 0,
  "message": null,
  "data": [
    {
      "id": "4",
      "login": "jack-4",
      "password": "126",
      "age": 15,
      "isDeleted": false
    }
  ]
}
```


## Update User

path: `/user`

method:`put` 

| FieldName   | FieldType | IsRequired |
| -------- | -------- | -------- |
| userid | string   | Yes       |
| login | string   | No       |
| password    | string   | No       |
| age    | number   | No      |

Request demo:

```json
{
  "id": "1",
  "login": "bode_he"
}
```

Response demo：

```json
// success
{
  "code": 0,
  "message": "update ok",
  "data": null
}
```


## Remove User

path: `/user/:userid`

method:`delete` 

| FieldName   | FieldType | IsRequired |
| -------- | -------- | -------- |
| userid | string   | Yes       |

Request demo:

```http
http://localhost:3000/api/v1/user/1
```

Response demo：

```json
// success
{
  "code": 0,
  "message": "remove ok",
  "data": null
}
```