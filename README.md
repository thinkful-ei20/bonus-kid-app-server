Bonus Kid Sever Endpoints
========================

To minimize fetch calls to the server, we store the data inside the auth token. Upon most requests sent to the server, we automatically return an updated authtoken holding all the updated data.


-------------------
# Parent Endpoints

Our parent calls to the endpoint will return updated authtokens that hold any updated data. The decoded JWT token will look like below: 

```

    {
      {
      "user": {
        "child": [
          {
            "totalPoints": 100,
            "currentPoints": 50,
            "tasks": [
              {
                "complete": false,
                "childComplete": false,
                "expiryDate": "",
                "currentTime": "",
                "name": "A on a test",
                "pointValue": 10,
                "childId": "5b57405c028ed933fc3d6bb7",
                "parentId": "5b57405c028ed933fc3d6bb3",
                "createdAt": "2018-07-24T15:06:04.779Z",
                "updatedAt": "2018-07-24T15:06:04.779Z",
                "id": "5b57405c028ed933fc3d6bbf"
              }
            ],
            "username": "some other kid",
            "name": "some other kid",
            "parentId": "5b57405c028ed933fc3d6bb3",
            "id": "5b57405c028ed933fc3d6bb7"
          }
        ],
        "rewards": [
          {
            "purchased": false,
            "expiryDate": "",
            "currentTime": "",
            "name": "trip to amusement park",
            "pointValue": 1000,
            "parentId": "5b57405c028ed933fc3d6bb3",
            "id": "5b57405c028ed933fc3d6bbb"
          }
        ],
        "username": "Tammy",
        "isParent": true,
        "name": "Tammy",
        "email": "Tammy@gmail.com",
        "id": "5b57405c028ed933fc3d6bb3"
      },
      "iat": 1532449375,
      "exp": 1533054175,
      "sub": "Tammy"
      }
    }
```



##PARENT ACCOUNT OPERATIONS

## PARENT ACCOUT LOGIN
- **POST/api/login**

### Request

``` 
    {
      "username": "user",
      "password": "password"
    }
```

###Response 

```
    {
      "authToken" : "authToken"
    }
```

The decoded authToken will provide all the necessary data to render the pages (see above).
Upon error, we return an unauthorized error.

```
    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
```

##REGISTER NEW PARENT ACCOUNT
- **POST/api/parent** 

### Request

``` 
  //required {'username', 'password', 'email'};

    {
      "name": "user",
      "email": "user@hello.com",
      "username": "user",
      "password": "password"
    }

```

### Response 
```
    {
      "authToken" : "authToken"
    }

```
The decoded authToken will provide all the necessary data to render the pages (See top of section).

##DELETE PARENT ACCOUNT
- **POST/api/parent** 

### Response 
```
    {
      "status" : 204
    }

```

## REGISTER NEW CHILD ACCOUNT TO PARENT

- **POST/api/parent/child** 

### Request
``` 
    //required {username, password, name}

    {
       "username":"MyChild",
       "password": "password",
       "name": "child"
    }
```

### Response 
```
    {
      "authToken" : "authToken"
    }

```
The decoded authToken will provide all the necessary data to render the pages (See top of section).

## DELETE CHILD ACCOUNT

- **POST/api/parent/child/:id'**

### Response 
```
    {
      "authToken" : "authToken"
    }

```
The decoded authToken will provide all the necessary data to render the pages (See top of section).


-------------------
# PARENT REWARD ENDPOINTS

Our calls to the reward endpoint will post to the ```/api/rewards/``` endpoint and return a new ```authToken```.
Below are what you can expect for the CRUD operations under a parent account.

## CREATE A REWARD
- **POST api/rewards**
### Request

```
  { 
    "name": "Candy",
    "pointValue": "50", 
    "purchased": false,
  }
```

### Response

```{
    "authToken" : "authToken"
  }
``` 

## EDIT A REWARD
- **PUT api/rewards/:id'**

### Request
```
  {
    "name": "Edited Candy"
    "pointValue": "25"
  }
```

### Response

```{
    "authToken" : "authToken"
  }
``` 

## DELETE A REWARD 
- **DELETE api/rewards/:id**

### Response

```{
    "authToken" : "authToken"
  }
``` 

