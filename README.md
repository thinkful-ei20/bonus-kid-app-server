Bonus Kid Sever Endpoints
========================

To minimize fetch calls to the server, we store the data inside the auth token. Upon most requests sent to the server, we automatically return an updated authtoken holding all the updated data.

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
## PARENT REWARD ENDPOINTS

Our calls to the reward endpoint will post to the ```/api/rewards/``` endpoint and return a new ```authToken```. Parents can edit and create rewards. Below are what you can expect for the CRUD operations under a parent account.

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

```
  {
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

```
  {
    "authToken" : "authToken"
  }
``` 

## DELETE A REWARD 
- **DELETE api/rewards/:id**

### Response

```
  {
    "authToken" : "authToken"
  }
``` 

## PARENT TASK ENDPOINTS

Parents can create, edit, approve, or delete tasks through the task endpoints. Our calls to the reward endpoint will post to the ```/api/tasks```  endpoint and return a new ```authToken```.


## CREATE A TASK FOR A CHILD
- **POST api/tasks/:childId**

### Request

```
  // name and pointValue are required
  // if no specific day/hour are submitted, the task will default to 0 indicating no due date.

  {
    "name": "Clean Room",
    "pointValue": "25"
    "day": 0
    "hour: 0
  }
```

### Response
```
  {
    "authToken" : "authToken"
  }
``` 

## UPDATE TASKS AS A PARENT
- **PUT api/tasks/:id**

The put endpoint is used to update task name, points, expire date as well as approve tasks.

### REQUEST TO UPDATE NAME/POINTS/EXPIRE

```
  //:id param is the task Id.
  // name and pointValue are required
  // if no specific day/hour are submitted, the task will default to 0 indicating no due date.

  {
    "name": "Clean Room",
    "pointValue": "50"
    "day": 0
    "hour: 0
  }
```

### REQUEST TO APPROVE TASK


Upon task approval, the child's ```currentPoints``` will be updated with the task ```pointValue```

```
  {
    "updatedTask.complete" : true 
  }
 ```


# Child Endpoints
Our child API currently has noticably less functionality. The will see their tasks displayed on their taskboard. They can submit their tasks for approval by the parent. On the Rewards page, the Child can make purchases.  

In future iterations of this app, children will have the ability to be proactive and submit/propose tasks in their dashboard.

Our child calls to the endpoints will return updated authtokens that hold any updated data, namely the fully populated ```tasks``` array. The decoded JWT token for children will look like below:

```
{
  "user": {
    "totalPoints": 0,
    "currentPoints": 0,
    "tasks": [
      {
        "complete": false,
        "childComplete": false,
        "expiryDate": "1532455104064",
        "currentTime": "1532455104064",
        "name": "test12",
        "pointValue": 456,
        "parentId": "5b57405c028ed933fc3d6bb1",
        "childId": "5b575877fc98db29604f6839",
        "createdAt": "2018-07-24T17:58:24.072Z",
        "updatedAt": "2018-07-24T17:58:24.072Z",
        "id": "5b5768c0b5e1c047a00b10a1"
      },
      {
        "complete": false,
        "childComplete": true,
        "expiryDate": "1532455134778",
        "currentTime": "1532455134778",
        "name": "test123",
        "pointValue": 456,
        "parentId": "5b57405c028ed933fc3d6bb1",
        "childId": "5b575877fc98db29604f6839",
        "createdAt": "2018-07-24T17:58:54.779Z",
        "updatedAt": "2018-07-24T19:36:38.465Z",
        "id": "5b5768deb5e1c047a00b10a2"
      }
    ],
    "username": "kiddo",
    "name": "kiddo",
    "parentId": "5b57405c028ed933fc3d6bb1",
    "id": "5b575877fc98db29604f6839"
  },
  "iat": 1532460998,
  "exp": 1533065798,
  "sub": "kiddo"
```

## CHILD ACCOUT LOGIN
- **POST/api/childLogin**

### Request

``` 
    {
      "username": "kiddo",
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

## CHILD REWARDS 

- **GET /api/rewards/child**

###Response 


```
[
    {
        "purchased": true,
        "expiryDate": "",
        "currentTime": "",
        "name": "trip to amusement park",
        "pointValue": 1000,
        "parentId": "5b57405c028ed933fc3d6bb3",
        "id": "5b57405c028ed933fc3d6bbb"
    }
]
```

- **PUT/api/rewards/child/:id** 

### Request

``` 
    // the :id params refers to the reward id
    // if the reward has already been purchased, a 400 error will be posted with the message: "Reward already purchased"

    {
      " purchased" = true
    }

```

###Response 

```
    {
      "authToken" : "authToken"
    }
```

## CHILD TASKS
- **PUT/api/tasks/child/:id** 

### Request

``` 
    // the :id params refers to the task id

    {
      "childComplete" = true
    }

```

###Response 

```
    {
      "authToken" : "authToken"
    }
```
