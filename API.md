# API Documentation

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Description:** Registers a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "64f8b0c3a5e7e6b8d7c1a9d9",
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Description:** Logs in a user and returns an authentication token.

**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "userId": "64f8b0c3a5e7e6b8d7c1a9d9"
}
```

---
## Broadcast Endpoints

### 3. Create Broadcast (Requires Authentication)
**Endpoint:** `POST /api/broadcasts/`

**Headers:**
```
Authorization: Bearer <token>
```

**Description:** Creates a new broadcast.

**Request Body:**
```json
{
  "userId": "64f8b0c3a5e7e6b8d7c1a9d9",
  "date": "2025-02-15",
  "time": "14:00",
  "location": "Central Park, NY",
  "activity": "Football match"
}
```

**Response:**
```json
{
  "_id": "67afb2e452ed0d7a9b469111",
  "userId": "64f8b0c3a5e7e6b8d7c1a9d9",
  "date": "2025-02-15",
  "time": "14:00",
  "location": "Central Park, NY",
  "activity": "Football match",
  "requests": [],
  "expiresAt": "2025-02-14T22:17:24.233Z",
  "__v": 0
}
```

### 4. Get All Broadcasts (Requires Authentication)
**Endpoint:** `GET /api/broadcasts/`

**Headers:**
```
Authorization: Bearer <token>
```

**Description:** Retrieves all available broadcasts.

**Response:**
```json
[
  {
    "_id": "67afb2e452ed0d7a9b469111",
    "userId": "64f8b0c3a5e7e6b8d7c1a9d9",
    "date": "2025-02-15",
    "time": "14:00",
    "location": "Central Park, NY",
    "activity": "Football match",
    "requests": [],
    "expiresAt": "2025-02-14T22:17:24.233Z",
    "__v": 0
  }
]
```

### 5. Join Broadcast (Requires Authentication)
**Endpoint:** `POST /api/broadcasts/joinBroadcast`

**Headers:**
```
Authorization: Bearer <token>
```

**Description:** Allows a user to join an existing broadcast.

**Request Body:**
```json
{
  "broadcastId": "67afb2e452ed0d7a9b469111"
}
```

**Response:**
```json
{
  "message": "Successfully joined the broadcast",
  "broadcastId": "67afb2e452ed0d7a9b469111"
}
```

