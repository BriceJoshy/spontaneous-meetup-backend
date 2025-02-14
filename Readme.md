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

**Note:** I have mailed the `.env` file with the cloud URLs if you wish to test it.

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

## 📡 API Integration Details

### 🛠️ Swagger API Documentation

Once the server is running, access API documentation at:

```
http://localhost:5000/api-docs
```

### 🔹 Sample API Routes

| Method | Endpoint           | Description                            |
| ------ | ------------------ | -------------------------------------- |
| GET    | `/broadcasts`      | Fetch active broadcasts (Redis Cached) |
| POST   | `/broadcasts/join` | Join a broadcast                       |
| POST   | `/auth/login`      | User login                             |
| POST   | `/auth/register`   | User registration                      |

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
