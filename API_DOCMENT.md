# TeamSphere API Documentation

Base URL

```txt
http://localhost:5000
```

Authorization Header

```http
Authorization: Bearer <token>
```

---

# Authentication

## Register User

Endpoint

```http
POST /auth/register
```

Request Body

```json
{
  "username": "Ashish",
  "email": "ashish@gmail.com",
  "password": "12345678"
}
```

Response

```json
{
  "message": "User registration completed",
  "token": "jwt-token"
}
```

---

## Login User

Endpoint

```http
POST /auth/login
```

Request Body

```json
{
  "email": "ashish@gmail.com",
  "password": "12345678"
}
```

Response

```json
{
  "message": "Login successful",
  "token": "jwt-token"
}
```

---

# Rooms

## Create Room

Endpoint

```http
POST /room/create-room
```

Headers

```http
Authorization: Bearer <token>
```

Request Body

```json
{
  "name": "Frontend Team",
  "description": "Frontend collaboration room"
}
```

Response

```json
{
  "message": "Room created successfully",
  "roomId": "room_id"
}
```

---

## Get My Rooms

Endpoint

```http
GET /room/get-my-rooms
```

Response

```json
{
  "message": "All Rooms created",
  "rooms": []
}
```

---

## Get Room Details

Endpoint

```http
GET /room/get-my-rooms/:roomId
```

Response

```json
{
  "message": "room details",
  "room": {}
}
```

---

## Add Member

Endpoint

```http
POST /room/add-member/:roomId
```

Request Body

```json
{
  "memberId": "user_id"
}
```

Response

```json
{
  "message": "Member added successfully"
}
```

---

## Remove Member

Endpoint

```http
DELETE /room/delete-member/:roomId
```

Request Body

```json
{
  "memberId": "user_id"
}
```

Response

```json
{
  "message": "The member deleted"
}
```

---

# Notices

## Create Notice

Endpoint

```http
POST /notice/create-notice/:roomId
```

Request Body

```json
{
  "title": "Meeting",
  "description": "Tomorrow at 5 PM"
}
```

Response

```json
{
  "message": "Notice created",
  "id": "notice_id"
}
```

---

## Get Notices

Endpoint

```http
GET /notice/notices/:roomId
```

Response

```json
{
  "message": "Notices present in this room",
  "notices": []
}
```

---

## Update Notice

Endpoint

```http
PATCH /notice/update-notice/:noticeId/:roomId
```

Request Body

```json
{
  "title": "Updated Title",
  "description": "Updated Description"
}
```

Response

```json
{
  "message": "Update successful"
}
```

---

## Delete Notice

Endpoint

```http
DELETE /notice/delete-notice/:noticeId
```

Response

```json
{
  "message": "Notice deleted"
}
```

---

# Files

## Upload File

Endpoint

```http
POST /file/upload-file/:roomId
```

Headers

```http
Content-Type: multipart/form-data
```

Form Data

```txt
file
description
```

Response

```json
{
  "message": "File uploaded successfully",
  "fileUrl": "https://...",
  "id": "file_id"
}
```

---

## Get Files

Endpoint

```http
GET /file/files/:roomId
```

Response

```json
{
  "message": "Files fetched",
  "files": []
}
```

---

## Delete File

Endpoint

```http
DELETE /file/delete-file/:roomId/:fileId
```

Response

```json
{
  "message": "File deleted successfully"
}
```
