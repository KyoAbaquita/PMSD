# TaskMan API Documentation

**Base URL**: `http://127.0.0.1:8000`  
**Authentication**: Sanctum Token (for protected routes)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Projects](#2-projects)
3. [Tasks](#3-tasks)
4. [HTTP Status Codes](#4-http-status-codes)

---

#

## 1. Authentication

### User Registration

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

### User Login

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

### User Logout

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

##

## 2. Projects

### Project

| Endpoint         | Method | Description        |
| ---------------- | ------ | ------------------ |
| `/projects`      | GET    | List all projects  |
| `/projects`      | POST   | Create new project |
| `/projects/{id}` | PUT    | Update project     |
| `/projects/{id}` | DELETE | Delete project     |

### Sample Create Request (Create Task)

```json
POST /projects
{
  "name": "Website Redesign",
  "description": "Redesign company homepage",
  "budget": 5000.00
}
```

### Sample Response (201)

```json
{
  "id": 1,
  "name": "Website Redesign",
  "description": "Redesign company homepage",
  "status": "pending",
  "budget": 5000.0,
  "created_at": "2023-08-15T12:00:00.000000Z"
}
```

##

## 3. Tasks

### Tasks

| Endpoint             | Method | Description         |
| -------------------- | ------ | ------------------- |
| `/tasks`             | POST   | Create task         |
| `/tasks/{id}/assign` | PATCH  | Assign task to user |

### Sample Create Request (Fix Login Bug)

```json
POST /tasks
{
  "title": "Fix login bug",
  "project_id": 5,
  "priority": "high"
}
```

### Sample Response (201)

```json
{
  "id": 1,
  "title": "Fix login bug",
  "project_id": 5,
  "priority": "high",
  "status": "todo",
  "created_at": "2023-08-15T12:00:00.000000Z"
}
```

##

## 4. HTTP Status Codes

### HTTP Status Codes

| Code | Meaning              | Typical Scenario          |
| ---- | -------------------- | ------------------------- |
| 200  | OK                   | Successful requests       |
| 201  | Cancel               | Resource creation success |
| 401  | Unauthorized         | Authentication failures   |
| 404  | Not Found            | Invalid resource ID       |
| 422  | Unprocessable Entity | Validation errors         |
| 500  | Server Error         | Backend failures          |

##
