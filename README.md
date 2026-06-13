# TeamSphere Backend

Backend API for TeamSphere, a team collaboration platform where users can create rooms, manage members, share notices, and upload files.

## Features

- User Authentication (JWT)
- Create and Manage Rooms
- Add and Remove Members
- Create, Update, Delete Notices
- Upload and Delete Files
- Supabase Storage Integration
- MongoDB Database
- Protected Routes using JWT Authentication

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Zod
- Multer
- Supabase Storage

---

## Project Structure

```txt
src
│
├── middleware
│   └── authMiddleware.ts
│
├── models
│   ├── User.ts
│   ├── Rooms.ts
│   ├── Notice.ts
│   └── Files.ts
│
├── routes
│   ├── auth.ts
│   ├── room.ts
│   ├── notice.ts
│   └── file.ts
│
├── services
│   ├── multer.ts
│   └── supabaseClient.ts
│
├── types
│   ├── authTypes.ts
│   ├── roomTypes.ts
│   ├── noticeTypes.ts
│   └── fileTypes.ts
│
└── index.ts
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build project

```bash
npm run build
```

Run production build

```bash
npm start
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

SUPABASE_URL=

SUPABASE_SERVICE_ROLE_KEY=
```

---

## Authentication

All protected routes require:

```http
Authorization: Bearer <jwt-token>
```

---

# API Documentation

Base URL

```txt
http://localhost:5000
```

---

## Authentication Routes

### Register

```http
POST /auth/register
```

Request

```json
{
  "username": "Ashish",
  "email": "ashish@example.com",
  "password": "password123"
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

### Login

```http
POST /auth/login
```

Request

```json
{
  "email": "ashish@example.com",
  "password": "password123"
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

## Room Routes

### Create Room

```http
POST /room/create-room
```

Request

```json
{
  "name": "Frontend Team",
  "description": "Room for frontend developers"
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

### Get My Rooms

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

### Get Room Details

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

### Add Member

```http
POST /room/add-member/:roomId
```

Request

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

### Remove Member

```http
DELETE /room/delete-member/:roomId
```

Request

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

## Notice Routes

### Create Notice

```http
POST /notice/create-notice/:roomId
```

Request

```json
{
  "title": "Project Meeting",
  "description": "Meeting tomorrow at 5 PM"
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

### Get Notices

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

### Update Notice

```http
PATCH /notice/update-notice/:noticeId/:roomId
```

Request

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

### Delete Notice

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

## File Routes

### Upload File

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

Supported File Types

```txt
pdf
png
jpg
jpeg
docx
```

Response

```json
{
  "message": "File uploaded successfully",
  "fileUrl": "https://storage-url",
  "id": "file_id"
}
```

---

### Get Files

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

### Delete File

```http
DELETE /file/delete-file/:roomId/:fileId
```

Response

```json
{
  "message": "File deleted successfully"
}
```

---

## Database Models

### User

```ts
{
  username: string;
  email: string;
  password: string;
}
```

### Room

```ts
{
  name: string;
  description: string;
  owner: ObjectId;
  members: ObjectId[];
}
```

### Notice

```ts
{
  title: string;
  description: string;
  ownerId: ObjectId;
  roomId: ObjectId;
}
```

### File

```ts
{
  fileName: string;
  fileUrl: string;
  fileType: string;
  description: string;
  uploadedBy: ObjectId;
  roomId: ObjectId;
}
```

---

## Future Improvements

- Real-time chat using Socket.IO
- Room invitations
- Search functionality
- Role-based permissions
- File previews
- Activity logs
- Notification system

---

## License

Copyright © 2026 Ashish Kunthe. All rights reserved.
