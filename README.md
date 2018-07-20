Bonus Kid Sever Endpoints
========================

[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.


Auth Endpoints
-------------------

- **POST/api/login** Endpoint to login as the parent

``` 
    //What you send

    {
      "username": "user",
      "password": "password"
    }

    //Success

    {
      "authToken" : "authToken"
    }

    //Error 

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
    
```
- **POST/api/childLogin** Endpoint to login as the child

``` 
    //What you send

    {
      "username": "user",
      "password": "password"
    }

    //Success

    {
      "authToken" : "authToken"
    }

    //Error 

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
    
```
Child Endpoints
-------------------


- **GET/api/child** Endpoint to get all childre

``` 
    //this endpoint is for testing and wont be on production

    //What you send

      Request to endpoint
        http://localhost:8080/api/child/

    //Success

    [
       {
        "totalPoints": 0,
        "currentPoints": 0,
        "tasks": [
            "5b50f9cc0e21b24db75ced90" //tasks array might be removed
        ],
        "username": "kiddo",
        "name": "kiddo",
        "parentId": "5b50f9c00e21b24db75ced84",
        "id": "5b50f9cb0e21b24db75ced88"
       }
    ]
    
```

- **GET/api/child/:id** Endpoint to get child with id

``` 
    //What you send

      Request to endpoint 
        http://localhost:8080/api/child/0b20f9cb1e11b24db45ced88

    //Success

    [
       {
        "totalPoints": 0,
        "currentPoints": 0,
        "tasks": [
            "5b50f9cc0e21b24db75ced90" //tasks array might be removed
        ],
        "username": "kiddo",
        "name": "kiddo",
        "parentId": "5b50f9c00e21b24db75ced84",
        "id": "5b50f9cb0e21b24db75ced88"
       }
    ]

    //Error

    {
      "message": "invalid id",
      "error": {
        "status": 400
       }
    }
    
```
Parent Endpoints
-------------------

- **POST/api/parent/:id** Endpoint to create new parent

``` 
    //required in req body {username, password, name, email}

    //What you send

    {
      "username": "kiddo",
      "password": "passsword",
      "name": "name",
      "email": "name@gmail.com"
    }

    //Success

    {
      "child": [],
      "username": "kiddo",
      "name": "name",
      "email": "name@gmail.com",
      "isParent": true,
      "id": "5b51fcfcb854a445d32e84d2"
    }

    //Error

    //Missing email in req body
    
    {
      "message": "Missing email in request body",
      "error": {
        "status": 422
      }
    }

    //Missing name in req body

    {
      "message": "name is required",
      "error": {
        "status": 400
      }
    }

    //Missing password in req body
    
    {
      "message": "Missing password in request body",
      "error": {
        "status": 422
      }
    }
    
    //Missing username in req body

    {
      "message": "Missing username in request body",
      "error": {
        "status": 422
      }
    }
    
```

- **GET/api/parent/** Endpoint to get all parents

``` 
    //this is a test endpoint wont be on production

    //What you send

    Request to endpoint 
        http://localhost:8080/api/parent

    //Success
    [
      {
        "child": [],
        "username": "kiddo",
        "name": "name",
        "email": "name@gmail.com",
        "isParent": true,
        "id": "5b51fcfcb854a445d32e84d2"
      }
    ]
    
```

- **POST/api/parent/child** Endpoint to create a child for the parent

``` 
    //required in req body {username, password, name}

    //What you send

    {
       "username":"Darren1",
       "password": "password",
       "name": "Darren"
    }

    //Success
    
    {
      "totalPoints": 0,
      "currentPoints": 0,
      "tasks": [],
      "username": "Darren1",
      "name": "Darren",
      "parentId": "5b51fffa3a17042dc8fa5231",
      "id": "5b52015d3be6962618d57997"
    }
    

    //Error

    //Missing name in req body

    {
      "message": "name is required",
      "error": {
        "status": 400
      }
    }

    //Missing password in req body
    
    {
      "message": "Missing password in request body",
      "error": {
        "status": 422
      }
    }

    //Missing username in req body

    {
      "message": "Missing username in request body",
      "error": {
        "status": 422
      }
    }
    
```

- **DELETE/api/parent/:id** Endpoint to delete a parent

``` 
    //What you send

     Request to endpoint 
        http://localhost:8080/api/parent/5b51fcfcb854a445d32e84d2

    //Success
    
    {
      "message": "Deleted parent user"
    }
    

    //Error

    //Missing id in params

    {
      "message": "Not Found",
      "error": {
        "status": 404
      }
    }
    
```

- **DELETE/api/parent/child/:id** Endpoint to delete a child

``` 

    //WIP

    //What you send

     Request to endpoint 
        http://localhost:8080/api/parent/child/5b51fcfcb854a445d32e84d2

    //Success
    
    {
      "message": "Deleted child user"
    }
    

    //Error

    //Missing id in params

    {
      "message": "invalid id",
      "error": {
        "status": 400
      }
    }
    
```

Reward Endpoints
-------------------

- **POST/api/rewards** Endpoint to create a reward

``` 
    //required in req body { name, pointValue, purchased}
    
    //What you send

     {
       "pointValue":"23",
       "purchased": "false",
       "name": "Darren"
     }

    //Success
    
    {
      "purchased": false,
      "expiryDate": "1532103435726",
      "currentTime": "1532103435726",
      "parentId": "5b51fffa3a17042dc8fa522f",
      "name": "Darren",
      "pointValue": 23,
      "id": "5b520b0bb4dbb8380c41594d"
    }
    

    //Error

    //Missing name in req body

    {
      "message": "name is required",
      "error": {
        "status": 400
      }
    }

    //Missing pointValue in req body

    {
      "message": "pointValue are required",
      "error": {
        "status": 400
      }
    }
    
```

- **GET/api/rewards** Endpoint to get a reward

``` 
    //required in req body { name, pointValue, purchased}
    
    //What you send

      Request to endpoint 
        http://localhost:8080/api/rewards

    //Success

    [
      {
        "purchased": false,
        "expiryDate": "",
        "currentTime": "",
        "name": "candy",
        "pointValue": 50,
        "parentId": "5b51fffa3a17042dc8fa522f",
        "id": "5b51fffc3a17042dc8fa5237"
      }
    ]

    //Error

    //Missing authToken

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
    
```

- **GET/api/rewards/child** Endpoint to get a rewards from child

``` 

    //What you send

      Request to endpoint 
        http://localhost:8080/api/rewards/child

    //Success

    [
      {
        "purchased": false,
        "expiryDate": "",
        "currentTime": "",
        "name": "candy",
        "points": 50,
        "parentId": "5b520d6c9932103a758f303a",
        "id": "5b520d6e9932103a758f3042"
      }
    ]

    //Error

    //Missing authToken

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
    
```

- **PUT/api/rewards/:id** Endpoint to update reward

``` 
    //required in req body { name, points }

    //What you send

      {
        "name": "name",
        "points": "points"
      }

    //Success

    {
      "purchased": false,
      "expiryDate": "",
      "currentTime": "",
      "name": "hello",
      "points": 32,
      "parentId": "5b520d6c9932103a758f303a",
      "id": "5b520d6e9932103a758f3042"
    }

    //Error

    //Missing authToken

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
    
```

- **DELETE/api/rewards/:id** Delete reward by id

``` 
    //What you send

      Request to endpoint 
        http://localhost:8080/api/rewards/5b520d6e9932103a758f3042

    //Success

    {
      "purchased": false,
      "expiryDate": "",
      "currentTime": "",
      "name": "hello",
      "points": 32,
      "parentId": "5b520d6c9932103a758f303a",
      "id": "5b520d6e9932103a758f3042"
    }

    //Error

    //Missing authToken

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
    
```

Tasks Endpoints
-------------------

- **GET/api/tasks/** Get all tasks 

``` 
    //What you send

      Request to endpoint 
        http://localhost:8080/api/tasks

    //Success

    [
      {
        "complete": false,
        "expiryDate": "",
        "currentTime": "",
        "childComplete": false,
        "name": "A on a test",
        "pointValue": 10,
        "child": "5b520d6e9932103a758f3040",
        "parentId": "5b520d6c9932103a758f303c",
        "createdAt": "2018-07-20T16:27:26.902Z",
        "updatedAt": "2018-07-20T16:27:26.902Z",
        "id": "5b520d6e9932103a758f3048"
      }
    ]

    //Error

    //Missing authToken

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
    
```

- **GET/api/tasks/child** Get all tasks for child

``` 
    //What you send

      Request to endpoint 
        http://localhost:8080/api/tasks/child

    //Success

    [
      {
        "complete": false,
        "expiryDate": "",
        "currentTime": "",
        "childComplete": false,
        "name": "daily chore",
        "pointValue": 5,
        "child": "5b520d6e9932103a758f303e",
        "parentId": "5b520d6c9932103a758f303a",
        "createdAt": "2018-07-20T16:27:26.902Z",
        "updatedAt": "2018-07-20T16:27:26.902Z",
        "id": "5b520d6e9932103a758f3046"
      }
    ]

    //Error

    //Missing authToken

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
    
```

- **GET/api/tasks/:childId** Get all tasks with childId

``` 
    //What you send

      Request to endpoint 
        http://localhost:8080/api/tasks/5b520d6e9932103a758f3046

    //Success

    [
      {
        "complete": false,
        "expiryDate": "",
        "currentTime": "",
        "childComplete": false,
        "name": "ya did gud, kid",
        "pointValue": 25,
        "child": "5b520d6e9932103a758f3041",
        "parentId": "5b520d6c9932103a758f303d",
        "createdAt": "2018-07-20T16:27:26.902Z",
        "updatedAt": "2018-07-20T16:27:26.902Z",
        "id": "5b520d6e9932103a758f3049"
      }
    ]

    //Error

    //Missing authToken

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }
    
```

- **POST/api/tasks/:childId** create a new task for the child

``` 
    //required in req body {name, pointValue}

    //What you send

    {
       "name": "name",
       "pointValue": "32"
    }

    //Success

    {
      "complete": false,
      "expiryDate": "1532110945811",
      "currentTime": "1532110945810",
      "name": "name",
      "pointValue": 32,
      "parentId": "5b520d6e9932103a758f303e",
      "child": "5b520d6e9932103a758f3041",
      "createdAt": "2018-07-20T18:22:25.819Z",
      "updatedAt": "2018-07-20T18:22:25.819Z",
      "id": "5b52286145c2dd08842d595b"
    }

    //Error

    //Missing authToken

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }

    //Missing pointValue

    {
      "message": "Missing pointValue in request body",
      "error": {
        "status": 422
      }
    }

    //Missing name

    {
      "message": "Missing name in request body",
      "error": {
        "status": 422
      }
    }
    
```

- **PUT/api/tasks/:id** update task

``` 
    //What you send

    {
       "name": "name1",
       "pointValue": "32"
    }

    //Success

    {
      "complete": false,
      "expiryDate": "1532110945811",
      "currentTime": "1532110945810",
      "name": "name1",
      "pointValue": 32,
      "parentId": "5b520d6e9932103a758f303e",
      "child": "5b520d6e9932103a758f3041",
      "createdAt": "2018-07-20T18:22:25.819Z",
      "updatedAt": "2018-07-20T18:22:25.819Z",
      "id": "5b52286145c2dd08842d595b"
    }

    //Error

    //Missing authToken

    {
      "message": "Unauthorized",
      "error": {
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401
      }
    }

    //Missing pointValue

    {
      "message": "Missing pointValue in request body",
      "error": {
        "status": 422
      }
    }

    //Missing name

    {
      "message": "Missing name in request body",
      "error": {
        "status": 422
      }
    }
    
```