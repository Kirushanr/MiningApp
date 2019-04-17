# Setting up application locally

### Environment variables

Add the following environment variables to your 
.env file.

```
DB_HOST=<YOUR MONGODB CONNECTION STRING>
NODE_ENV=development
JWT_SECRET=<YOUR SECRET KEY ENCRYPT JWT TOKEN>
GOOGLE_CLIENT_ID=<YOUR GOOGLE CLIENT ID>
GOOGLE_CLIENT_SECRET=<YOUR GOOGLE CLIENT SECRET>
GOOGLE_CALLBACK_URL=<YOUR GOOGLE CALLBACK URL>
REDIRECT_URL = <REDIRECT AFTER SUCCESSFUL AUTHENTICATION>
```

Run ```npm install``` to install required packages.



# API Documentation

## Payload Overview

| PARAMETERS    | TYPE          | 
| ------------- |:--------------| 
| assessmentId  | integer       | 
| vendorName    | string        | 
| safety        | integer       | 
| safetyComment | string        |
| quality       | integer       |
| qualityComment| string        |
| Notes         | string        |

## HTTP methods & Descriptions

| HTTP method   | RESOURCE      |    DESCRIPTION         | 
| ------------- |:--------------|:-----------------------| 
| GET           |api/assessments|Retrieve all assessments|
| GET           |api/assessment/1| Retrieve the details for assessment 1 if exists|
| POST          |api/assessments|Create new assessment   |
| PUT           |api/assessments/1 |Update details of assessment if exists|
| DELETE        |api/assessments/1 |Delete assessment if exists|
|GET            |auth/google       | Sign on with Google        |
|GET            |auth/google/callback/| Retrieves user detail after authentication|


## API Resource description

### GET /api/assessments
<details>
  <summary>View description </summary>

  **Header:**

  `x-auth-token`
   Send JSON Web Token in the headers

  **Success Response**

    HTTP status code : 200
    {
    "message": "Assessments found",
    "data": [
        {
            "_id": "5cb72ad76f61520016bf9b19",
            "assessmentId": 19564,
            "vendorName": "Komatsu",
            "safety": 4,
            "safetyComment": "Safe",
            "quality": "Good",
            "qualityComment": "Good quality",
            "Notes": "Re-assess in a week",
            "userId": "5cb70d8936701e0016b1be23",
            "__v": 0
        }
    ]
   }

   {
    "message": "No assessments were created",
    "data": []
    }

  **Error Response**
    
    HTTP status code : 403
    {
        message : Forbidden
    }

    HTTP status code : 401
    {
        errors:
        [
            { 
                "location": "header",
               "param": "x-auth-token",
                "value": token value, 
                "msg": "Token has expired" 
            }
        ]
    }

</details>


### GET /api/assessments/:assessmentId
<details>
  <summary>View description </summary>

  **Param**

  `id:required`

   Assessment ID

  **Header:**

  `x-auth-token:required`
  
   Send JSON Web Token in the headers

  **Success Response**

    HTTP status code : 200
    {
    "message": "Assessment found",
    "data": {
        "_id": "5cb72ad76f61520016bf9b19",
        "assessmentId": 19564,
        "vendorName": "Komatsu",
        "safety": 4,
        "safetyComment": "Safe",
        "quality": "Good",
        "qualityComment": "Good quality",
        "Notes": "Re-assess in a week",
        "userId": "5cb70d8936701e0016b1be23",
        "__v": 0
        }
    }

  **Error Response**
    
    HTTP status code : 403
    {
        message : Forbidden
    }

    HTTP status code : 401
    {
        errors:
        [
            { 
                "location": "header",
               "param": "x-auth-token",
                "value": token, 
                "msg": "Token has expired" 
            }
        ]
    }

    HTTP status code : 422
    {
        errors:
        [
            {  "location": "params",
                "param": "id",
                "value": "19564a",
                "msg": "Please enter a valid assessment number E.g. 19465 "
            }
        ]
    }

    HTTP status code 404
    {
    "message": "Assessment detail not found",
    "data": []
    }
</details>



### POST /api/assessments/
<details>
  <summary>View description </summary>

  **Body**

  `assessmentId:required`

  `vendorName:required`

  `safety:required`

  `safetyComment:required`

  `quality:required`

  `qualityComment:required`

  `Notes:optional` 
  

  **Header:**

  `x-auth-token:required`
  
   Send JSON Web Token in the headers

  **Success Response**

    HTTP status code : 200
    {
    "message": "Assessment created successfully",
    "data": {
        "_id": "5cb72ad76f61520016bf9b19",
        "assessmentId": 19564,
        "vendorName": "Komatsu",
        "safety": 4,
        "safetyComment": "Safe",
        "quality": "Good",
        "qualityComment": "Good quality",
        "Notes": "Re-assess in a week",
        "userId": "5cb70d8936701e0016b1be23",
        "__v": 0
        }
    }

  **Error Response**
    
    HTTP status code : 403
    {
        message : Forbidden
    }

    HTTP status code : 401
    {
        errors:
        [
            { 
                "location": "header",
               "param": "x-auth-token",
                "value": token, 
                "msg": "Token has expired" 
            }
        ]
    }

    HTTP status code : 422
    {
        errors:
        [
            {  "location": "params",
                "param": "id",
                "value": "19564a",
                "msg": "Please enter a valid assessment number E.g. 19465 "
            }
        ]
    }

</details>


### PUT /api/assessments/:assessmentId
<details>
  <summary>View description </summary>

  **Param**

  `assessmentId:required`

  **Body**

  `vendorName:required`

  `safety:required`

  `safetyComment:required`

  `quality:required`

  `qualityComment:required`

  `Notes:optional` 
  

  **Header:**

  `x-auth-token:required`
  
   Send JSON Web Token in the headers

  **Success Response**

    HTTP status code : 200
    {
    "message": "Assessment updated successfully",
    "data": {
        "_id": "5cb72ad76f61520016bf9b19",
        "assessmentId": 19564,
        "vendorName": "Komatsu",
        "safety": 4,
        "safetyComment": "Safe",
        "quality": "Good",
        "qualityComment": "Exceeds expectation",
        "Notes": "Re-assess in a week",
        "userId": "5cb70d8936701e0016b1be23",
        "__v": 0
        }
    }

  **Error Response**
    
    HTTP status code : 403
    {
        message : Forbidden
    }

    HTTP status code : 401
    {
        errors:
        [
            { 
                "location": "header",
               "param": "x-auth-token",
                "value": token, 
                "msg": "Token has expired" 
            }
        ]
    }

    HTTP status code : 422
    {
        errors:
        [
            {  "location": "params",
                "param": "id",
                "value": "19564a",
                "msg": "Please enter a valid assessment number E.g. 19465 "
            }
        ]
    }

    HTTP status code 404

    {
    "message": "No matching assessment found",
    "data": []
    }

</details>

### DELETE /api/assessments/:assessmentId
<details>
  <summary>View description </summary>

  **Param**

  `assessmentId:required`

  

  **Header:**

  `x-auth-token:required`
  
   Send JSON Web Token in the headers

  **Success Response**

    HTTP status code : 200
    {
    "message": "Assessment deleted successfully",
    "data": {
        "_id": "5cb72ad76f61520016bf9b19",
        "assessmentId": 19564,
        "vendorName": "Komatsu",
        "safety": 4,
        "safetyComment": "Safe",
        "quality": "Good",
        "qualityComment": "Exceeds expectation",
        "Notes": "Re-assess in a week",
        "userId": "5cb70d8936701e0016b1be23",
        "__v": 0
         }
    }
    
  **Error Response**
    
    HTTP status code : 403
    {
        message : Forbidden
    }

    HTTP status code : 401
    {
        errors:
        [
            { 
                "location": "header",
               "param": "x-auth-token",
                "value": token, 
                "msg": "Token has expired" 
            }
        ]
    }

    HTTP status code : 422
    {
        errors:
        [
            {  "location": "params",
                "param": "id",
                "value": "19564a",
                "msg": "Please enter a valid assessment number E.g. 19465 "
            }
        ]
    }

</details>

## API Single Sign On and JWT

API implementation uses Google Single Sign on using 
[passport Oauth2](http://www.passportjs.org/packages/passport-google-oauth2/).

### Response

On successful authentication `/auth/google/callback`
returns user detail and JSON WEB TOKEN in the header
```x-auth-token```.


To pass the JWT to Client application, the JWT 
could be sent to the client via cookie.


**Successful authentication response**

```
{
    "_id":"5cb70d8936701e0016b1be23",
    "googleId":"11163855373523",
    "fullName":"John Doe",
    "__v":0
}
```
1) _id : UserID of the User
2) googleId : Google providerID
3) fullName : Full name of the user 


