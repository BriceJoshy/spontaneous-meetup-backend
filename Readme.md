# Spontaneous Meetup Backend

## Project Setup Instructions

### Prerequisites
- Install [Node.js](https://nodejs.org/) (version 18+ recommended)
- Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- Install [MongoDB](https://www.mongodb.com/atlas/database) or use a cloud database
- Install [Kafka](https://kafka.apache.org/) (if running locally) or use a managed Kafka service

### Installation Steps
1. **Clone the repository**
   ```sh
   git clone https://github.com/BriceJoshy/spontaneous-meetup-backend.git
   cd spontaneous-meetup-backend
   ```
2. **Create a `.env` file** (Refer to `.env.example` for required variables)
3. **Install dependencies**
   ```sh
   npm install
   ```
4. **Start services using Docker Compose**
   ```sh
   docker-compose up -d
   ```
5. **Run the backend server**
   ```sh
   node index.js
   ```
6. **Wait for Kafka to connect (approximately 10 seconds)**

---

## Monorepo Structure Explanation
```
backend/
│── backgroundWorker/      # Background workers (e.g., cleanup tasks)
│── config/                # Configuration files (Redis, Swagger, Kafka, etc.)
│── controllers/           # Route controllers for handling business logic
│── docker/                # Docker configuration files
│── middleware/            # Middleware functions (e.g., authentication)
│── models/                # Mongoose models
│── notifications_kafkaClient/ # Kafka producer and consumer logic
│── routes/                # API routes
│── tests/                 # Unit and integration tests
│── index.js               # Main entry point of the backend
│── package.json           # Node.js dependencies and scripts
```

---

## CI/CD Pipeline Configuration and Usage Guide

- **Automated Tests**: Runs unit and integration tests before deployments.
- **Docker Build**: The backend is built and pushed to a container registry.
- **Deployment**: Deploys the latest backend version to the hosting provider.
- **Environment Variables**: Managed securely in GitHub Actions secrets.

_Example CI/CD pipeline using GitHub Actions:_
```yaml
name: Backend CI/CD

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build Docker image
        run: docker build -t backend-image .
      - name: Push to Registry
        run: docker push backend-image
```

---

## API Integration Details

- The backend exposes a RESTful API.
- Uses **Redis caching** to reduce load on MongoDB.
- Uses **Kafka** for real-time event-driven messaging.
- Swagger documentation available at `http://localhost:5000/api-docs`
- [Postman API Collection](https://www.getpostman.com/collections/your-collection-id)
- [GitHub Repository](https://github.com/BriceJoshy/spontaneous-meetup-backend.git)

---

## API Documentation

### Authentication Endpoints

#### 1. Register User
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

#### 2. Login User
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

### Broadcast Endpoints (Requires Authentication)

**Note:**
- For **broadcast endpoints**, you need to pass the Bearer token in the request headers.
- After logging in, copy the token and authorize in Swagger UI (top right) before making requests.
- For joining a broadcast, copy the `broadcastId` from the creation or listing response.

#### 3. Create Broadcast
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

---

## 🔹 Sample API Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and retrieve token
- `POST /api/broadcasts/` - Create a new broadcast
- `GET /api/broadcasts/` - Retrieve all available broadcasts
- `POST /api/broadcasts/joinBroadcast` - Join an existing broadcast

---

## Conclusion

The **Spontaneous Meetup Backend** provides a robust API for managing spontaneous social meetups with authentication, real-time event messaging, and efficient database caching. The system is built using modern technologies, ensuring scalability and performance. This documentation serves as a guide for setup, API usage, and CI/CD deployment, enabling seamless integration and development.

For detailed API testing, refer to:
- [Swagger API Docs](http://localhost:5000/api-docs)
- [Postman API Collection](https://www.getpostman.com/collections/your-collection-id)
- [GitHub Repository](https://github.com/BriceJoshy/spontaneous-meetup-backend.git)

