# Spontaneous Meetup - Backend

## 📌 Project Overview

The backend for the **Spontaneous Meetup** application provides APIs for managing broadcasts, user authentication, and event notifications. It uses **Node.js, Express, MongoDB, Kafka, Redis, and Docker** for a scalable and efficient architecture.

---

## 🚀 Project Setup Instructions

### 1️⃣ Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+)
- **MongoDB** (local or cloud instance)
- **Kafka** (local setup or cloud provider)
- **Redis** (Upstash or local instance)
- **Docker** (for containerization)

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/your-repo/spontaneous-meetup-backend.git
cd spontaneous-meetup-backend
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/spontaneous_meetup
JWT_SECRET=your_secret_key
KAFKA_BROKER=localhost:9092
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

> **Note:** I have mailed the `.env` file with the cloud URLs if you wish to test it.

### 5️⃣ Start Services

Start **MongoDB**, **Kafka**, and **Redis** before running the server.

### 6️⃣ Start the Backend Server

```bash
npm start
```

The backend should now be running on `http://localhost:5000`.

---

## 📂 Monorepo Structure Explanation

```
backend/
│── backgroundWorker/  # Automated background tasks
│── config/            # Configuration files (Redis, Swagger, etc.)
│── controllers/       # API route handlers
│── middleware/        # Middleware functions (authentication, logging, etc.)
│── models/           # MongoDB database schemas
│── notifications_kafkaClient/  # Kafka producer & consumer setup
│── routes/           # Express API routes
│── tests/            # Unit and integration tests
│── Dockerfile        # Docker container configuration
│── server.js         # Express server entry point
└── README.md         # Documentation
```

---

## 🔄 CI/CD Pipeline Configuration and Usage Guide

### 🛠️ GitHub Actions Workflow (Example)

This project can be integrated with GitHub Actions for automated CI/CD.

**.github/workflows/deploy.yml:**

```yaml
name: Backend CI/CD

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test
      - name: Build & Deploy (Docker)
        run: |
          docker build -t meetup-backend .
          docker run -p 5000:5000 meetup-backend
```

---

# API Documentation

## 🛠️ Swagger API Documentation

Once the server is running, access API documentation at:

[Swagger API Docs](http://localhost:5000/api-docs)

**Note:** After logging in, you must copy the token from the response and authorize Swagger at the top right corner for the broadcast APIs to work. Similarly, when creating a broadcast, copy the `broadcastId` from the response to use in subsequent API calls.

## API Endpoints

Here's the corrected table with proper endpoints:  

| Method | Endpoint               | Description                            |
|--------|------------------------|----------------------------------------|
| GET    | `/api/broadcasts`      | Fetch active broadcasts (Redis Cached) |
| POST   | `/api/broadcasts/join` | Join a broadcast                       |
| POST   | `/api/auth/login`      | User login                             |
| POST   | `/api/auth/register`   | User registration                      |

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

Frontend can interact with these endpoints using **REST API calls**.

---

## 🧪 Testing Guide

### 🏗️ Running Tests

```bash
npm test
```

**Test Structure:**

- **Unit Tests**: Test individual functions (e.g., controllers, models).
- **Integration Tests**: Validate API responses using Supertest.
- **Mocking**: Redis, Kafka, and MongoDB can be mocked for efficient testing.

---

## 📦 App Distribution Details

### 🚀 Deployment Details

- **Hosting Provider:** AWS EC2 / DigitalOcean / Railway.app
- **Deployment Commands:**

```bash
# Build Docker Image
docker build -t meetup-backend .

# Run the container
docker run -p 5000:5000 meetup-backend
```

- **Versioning Strategy:**
  - Use **Git Tags** for releases (e.g., `v1.0.0`).
  - Follow **Semantic Versioning** (`major.minor.patch`).

---

## 🎯 Conclusion

This backend powers the **Spontaneous Meetup** app by providing a scalable, event-driven architecture. It efficiently manages user broadcasts, caching, real-time messaging, and background job processing.

For further development or contributions, feel free to submit PRs or issues!
