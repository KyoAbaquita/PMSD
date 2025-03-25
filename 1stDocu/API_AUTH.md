# **3 Authentication API Documentation**

**Base URL**: `http://127.0.0.1:8000`  
**Authentication**: Sanctum Token (for protected routes)

---

## **1. User Registration**

**Endpoint**: `POST /register`  
**Description**: Creates a new user account with role assignment.

### Request Body (JSON):

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "team_member"
}

Success Response (HTTP 201):
{
  "message": "User registered successfully!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "team_member",
    "updated_at": "2023-08-15T12:00:00.000000Z",
    "created_at": "2023-08-15T12:00:00.000000Z"
  }
}

Validation Error (HTTP 422):
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "role": ["The selected role is invalid."]
  }
}
```

## **2. User Login**

**Endpoint**: `POST /Login`  
**Description**: Authenticates user and returns access token.

### Request Body (JSON):

```JSON
{
  "email": "john@example.com",
  "password": "password123"
}

Success Response (HTTP 200):
{
  "message": "Login successful!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "team_member"
  },
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz"
}

Invalid Credentials (HTTP 401):
{
  "message": "Invalid credentials"
}
```

## **2. User Logout**

**Endpoint**: `POST /Logout`  
**Description**: Revokes all current user tokens (requires authentication).

### Request Body (JSON):

```JSON

HEADERS:
Authorization: Bearer <token>
Accept: application/json

Success Response (HTTP 200):
{
  "message": "Logged out successfully"
}

Invalid Credentials (HTTP 401):
{
  "message": "Unauthenticated."
}
```

## **HTTP Status Codes Reference**

| Code | Meaning      | Typical Scenario                 |
| ---- | ------------ | -------------------------------- |
| 200  | Success      | Registration/login successful.   |
| 401  | Unauthorized | Wrong password or invalid token. |
