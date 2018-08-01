# Bonus Kid Client
Did she get all A's in school?
Did he do all his chores?
Those kids deserve a bonus!

### Live client!
https://dashboard.heroku.com/apps/bonus-kid-client

Create an account and start earning! It's that simple! finish tasks, get rewarded!
If your task is complete on time, you'll get full points towards awesome rewards!

## Features
- Give your children rewards for being productive!
- Add tasks for them to complete.
- Verify if your child has completed their tasks and reward them with points.
- Children will be able to buy from the parents store!

## Code style
Standard/Thinkful-style

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

### Back-End Tech:
- jwt-decode
- Express
- bcrypt
- momentjs
- nodemon
- passport
- passport-jwt
- passport-local

Bonus Kid Sever Endpoints
========================

To minimize fetch calls to the server, we store the data inside the auth token. Upon most requests sent to the server, we automatically return an updated authtoken holding all the updated data.

# Parent Endpoints

Our parent calls to the endpoint will return updated authtokens that hold any updated data. The decoded JWT token will look like below: 

```
{
  "user": {
    "child": [
      {
        "totalPoints": 75,
        "currentPoints": 75,
        "tasks": [
          {
            "complete": true,
            "childComplete": true,
            "expiryDate": "1532962561393",
            "currentTime": "1532962561393",
            "updatedTime": "1532964124474",
            "name": "343",
            "pointValue": 43,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "createdAt": "2018-07-30T14:56:01.395Z",
            "updatedAt": "2018-07-30T15:24:21.404Z",
            "id": "5b5f2701dbc9ec2044faf96f"
          },
          {
            "complete": true,
            "childComplete": true,
            "expiryDate": "1532963906161",
            "currentTime": "1532963906160",
            "updatedTime": "1532964357190",
            "name": "tete",
            "pointValue": 32,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "createdAt": "2018-07-30T15:18:26.169Z",
            "updatedAt": "2018-07-30T15:26:21.278Z",
            "id": "5b5f2c4216a4180a249059a5"
          },
          {
            "complete": false,
            "childComplete": false,
            "expiryDate": "1532965351709",
            "currentTime": "1532965351709",
            "updatedTime": null,
            "name": "fs",
            "pointValue": 42,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "createdAt": "2018-07-30T15:42:31.710Z",
            "updatedAt": "2018-07-30T15:42:31.710Z",
            "id": "5b5f31e7345189210852f749"
          }
        ],
        "rewards": [
          {
            "purchased": false,
            "expiryDate": "1532963656305",
            "currentTime": "1532963656305",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "name": "434343",
            "pointValue": 32,
            "id": "5b5f2b4840fa571db4f4e0f1"
          },
          {
            "purchased": false,
            "expiryDate": "1532964290574",
            "currentTime": "1532964290574",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "name": "dsad",
            "pointValue": 32,
            "id": "5b5f2dc2deb49317942e4d34"
          },
          {
            "purchased": false,
            "expiryDate": "1532965037275",
            "currentTime": "1532965037275",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "name": "r2",
            "pointValue": 32,
            "id": "5b5f30ad345189210852f745"
          }
        ],
        "username": "testing",
        "name": "testing",
        "parentId": "5b5f2584dbc9ec2044faf96d",
        "id": "5b5f26efdbc9ec2044faf96e"
      },
      {
        "totalPoints": 0,
        "currentPoints": 0,
        "tasks": [
          {
            "complete": false,
            "childComplete": false,
            "expiryDate": "1532964994432",
            "currentTime": "1532964994431",
            "updatedTime": null,
            "name": "fs",
            "pointValue": 31,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f2de6deb49317942e4d35",
            "createdAt": "2018-07-30T15:36:34.443Z",
            "updatedAt": "2018-07-30T15:36:34.443Z",
            "id": "5b5f3082345189210852f743"
          },
          {
            "complete": false,
            "childComplete": false,
            "expiryDate": "1532965357098",
            "currentTime": "1532965357098",
            "updatedTime": null,
            "name": "tete",
            "pointValue": 42,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f2de6deb49317942e4d35",
            "createdAt": "2018-07-30T15:42:37.099Z",
            "updatedAt": "2018-07-30T15:42:37.099Z",
            "id": "5b5f31ed345189210852f74a"
          }
        ],
        "rewards": [
          {
            "purchased": false,
            "expiryDate": "1532965043274",
            "currentTime": "1532965043274",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f2de6deb49317942e4d35",
            "name": "rere",
            "pointValue": 43,
            "id": "5b5f30b3345189210852f746"
          },
          {
            "purchased": false,
            "expiryDate": "1532965071492",
            "currentTime": "1532965071492",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f2de6deb49317942e4d35",
            "name": "this is a test",
            "pointValue": 43,
            "id": "5b5f30cf345189210852f748"
          }
        ],
        "username": "test2",
        "name": "test",
        "parentId": "5b5f2584dbc9ec2044faf96d",
        "id": "5b5f2de6deb49317942e4d35"
      }
    ],
    "username": "noRewards",
    "name": "test",
    "email": "noRewards@gmail.com",
    "isParent": true,
    "id": "5b5f2584dbc9ec2044faf96d"
  },
  "iat": 1533092329,
  "exp": 1533697129,
  "sub": "noRewards"
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
    translates to: 
    {
  "user": {
    "child": [
      {
        "totalPoints": 75,
        "currentPoints": 75,
        "tasks": [
          {
            "complete": true,
            "childComplete": true,
            "expiryDate": "1532962561393",
            "currentTime": "1532962561393",
            "updatedTime": "1532964124474",
            "name": "343",
            "pointValue": 43,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "createdAt": "2018-07-30T14:56:01.395Z",
            "updatedAt": "2018-07-30T15:24:21.404Z",
            "id": "5b5f2701dbc9ec2044faf96f"
          },
          {
            "complete": true,
            "childComplete": true,
            "expiryDate": "1532963906161",
            "currentTime": "1532963906160",
            "updatedTime": "1532964357190",
            "name": "tete",
            "pointValue": 32,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "createdAt": "2018-07-30T15:18:26.169Z",
            "updatedAt": "2018-07-30T15:26:21.278Z",
            "id": "5b5f2c4216a4180a249059a5"
          },
          {
            "complete": false,
            "childComplete": false,
            "expiryDate": "1532965351709",
            "currentTime": "1532965351709",
            "updatedTime": null,
            "name": "fs",
            "pointValue": 42,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "createdAt": "2018-07-30T15:42:31.710Z",
            "updatedAt": "2018-07-30T15:42:31.710Z",
            "id": "5b5f31e7345189210852f749"
          }
        ],
        "rewards": [
          {
            "purchased": false,
            "expiryDate": "1532963656305",
            "currentTime": "1532963656305",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "name": "434343",
            "pointValue": 32,
            "id": "5b5f2b4840fa571db4f4e0f1"
          },
          {
            "purchased": false,
            "expiryDate": "1532964290574",
            "currentTime": "1532964290574",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "name": "dsad",
            "pointValue": 32,
            "id": "5b5f2dc2deb49317942e4d34"
          },
          {
            "purchased": false,
            "expiryDate": "1532965037275",
            "currentTime": "1532965037275",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f26efdbc9ec2044faf96e",
            "name": "r2",
            "pointValue": 32,
            "id": "5b5f30ad345189210852f745"
          }
        ],
        "username": "testing",
        "name": "testing",
        "parentId": "5b5f2584dbc9ec2044faf96d",
        "id": "5b5f26efdbc9ec2044faf96e"
      },
      {
        "totalPoints": 0,
        "currentPoints": 0,
        "tasks": [
          {
            "complete": false,
            "childComplete": false,
            "expiryDate": "1532964994432",
            "currentTime": "1532964994431",
            "updatedTime": null,
            "name": "fs",
            "pointValue": 31,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f2de6deb49317942e4d35",
            "createdAt": "2018-07-30T15:36:34.443Z",
            "updatedAt": "2018-07-30T15:36:34.443Z",
            "id": "5b5f3082345189210852f743"
          },
          {
            "complete": false,
            "childComplete": false,
            "expiryDate": "1532965357098",
            "currentTime": "1532965357098",
            "updatedTime": null,
            "name": "tete",
            "pointValue": 42,
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f2de6deb49317942e4d35",
            "createdAt": "2018-07-30T15:42:37.099Z",
            "updatedAt": "2018-07-30T15:42:37.099Z",
            "id": "5b5f31ed345189210852f74a"
          }
        ],
        "rewards": [
          {
            "purchased": false,
            "expiryDate": "1532965043274",
            "currentTime": "1532965043274",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f2de6deb49317942e4d35",
            "name": "rere",
            "pointValue": 43,
            "id": "5b5f30b3345189210852f746"
          },
          {
            "purchased": false,
            "expiryDate": "1532965071492",
            "currentTime": "1532965071492",
            "parentId": "5b5f2584dbc9ec2044faf96d",
            "childId": "5b5f2de6deb49317942e4d35",
            "name": "this is a test",
            "pointValue": 43,
            "id": "5b5f30cf345189210852f748"
          }
        ],
        "username": "test2",
        "name": "test",
        "parentId": "5b5f2584dbc9ec2044faf96d",
        "id": "5b5f2de6deb49317942e4d35"
      }
    ],
    "username": "noRewards",
    "name": "test",
    "email": "noRewards@gmail.com",
    "isParent": true,
    "id": "5b5f2584dbc9ec2044faf96d"
  },
  "iat": 1533092329,
  "exp": 1533697129,
  "sub": "noRewards"
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
- **PUT/api/child/:id** 

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
- **PUT/api/child/:id** 

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
