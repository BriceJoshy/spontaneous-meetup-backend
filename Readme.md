# Spontaneous Meetup Backend

## WebSocket Events

### 1. `connect`
- **Triggered When:** A user connects to the WebSocket server.
- **Payload:**
  ```json
  {
    "userId": "64f8b0c3a5e7e6b8d7c1a9d9"
  }
  ```
- **Response:**
  ```json
  {
    "status": "connected",
    "userId": "64f8b0c3a5e7e6b8d7c1a9d9"
  }
  ```

### 2. `disconnect`
- **Triggered When:** A user disconnects from the WebSocket server.
- **Payload:** _None_
- **Response:** _None_

### 3. `sendMessage`
- **Triggered When:** A user sends a message in a chat.
- **Payload:**
  ```json
  {
    "chatId": "abc123",
    "senderId": "64f8b0c3a5e7e6b8d7c1a9d9",
    "message": "Hello, how are you?"
  }
  ```
- **Response:**
  ```json
  {
    "status": "sent",
    "messageId": "xyz456",
    "timestamp": "2025-02-15T12:34:56Z"
  }
  ```

### 4. `receiveMessage`
- **Triggered When:** A new message is received in a chat.
- **Payload:**
  ```json
  {
    "chatId": "abc123",
    "message": {
      "messageId": "xyz456",
      "senderId": "64f8b0c3a5e7e6b8d7c1a9d9",
      "message": "Hello, how are you?",
      "timestamp": "2025-02-15T12:34:56Z"
    }
  }
  ```
- **Response:** _None_

### 5. `userTyping`
- **Triggered When:** A user starts typing in a chat.
- **Payload:**
  ```json
  {
    "chatId": "abc123",
    "userId": "64f8b0c3a5e7e6b8d7c1a9d9"
  }
  ```
- **Response:** _None_

### 6. `userStoppedTyping`
- **Triggered When:** A user stops typing in a chat.
- **Payload:**
  ```json
  {
    "chatId": "abc123",
    "userId": "64f8b0c3a5e7e6b8d7c1a9d9"
  }
  ```
- **Response:** _None_

### 7. `newNotification`
- **Triggered When:** A user receives a new notification.
- **Payload:**
  ```json
  {
    "userId": "64f8b0c3a5e7e6b8d7c1a9d9",
    "notification": {
      "title": "New Meetup Request",
      "message": "You have a new meetup request from Alex.",
      "timestamp": "2025-02-15T12:35:00Z"
    }
  }
  ```
- **Response:** _None_

### 8. `meetupStatusUpdate`
- **Triggered When:** The status of a meetup changes.
- **Payload:**
  ```json
  {
    "meetupId": "meetup789",
    "status": "confirmed",
    "updatedBy": "admin"
  }
  ```
- **Response:** _None_

---

For more details on integrating WebSocket events, refer to the API documentation.

