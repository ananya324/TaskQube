# TaskQube 🚀

A real-time collaborative workspace platform that combines task management, team communication, collaborative notes, and meeting coordination into a single workspace.

Built using the MERN stack, Socket.IO, and modern React architecture to provide seamless real-time collaboration for distributed teams.

## 🌐 Live Demo

**Live Application:** https://task-qube.vercel.app

---

## 📌 Overview

TaskQube is designed to help teams collaborate efficiently within a shared workspace. It provides task assignment, real-time communication, collaborative note-taking, online presence tracking, meeting coordination, and activity monitoring — all in one place.

The platform enables administrators to manage teams, assign work, and organize collaboration while members stay updated through instant synchronization powered by Socket.IO.

---

## ✨ Features

### 👥 Workspace Management

* Create and manage collaborative workspaces
* Join workspaces using private invite codes
* Workspace owner controls invite code visibility
* Secure workspace membership system
* Real-time member synchronization

### ✅ Task Management

* Assign tasks to specific team members
* Set task titles, descriptions, priorities, and deadlines
* Priority levels:

  * High 🔴
  * Medium 🟡
  * Low 🟢
* Track task status updates in real time
* Personal task view for members
* Team-wide task visibility
* Overdue task highlighting
* Upcoming deadline warnings
* Instant synchronization across all connected users

### 📝 Collaborative Notes

* Create multiple workspace notes
* Shared note editing environment
* Structured bullet-point formatting
* Real-time updates across workspace members
* Persistent note storage

### 💬 Real-Time Team Chat

* Workspace-level messaging
* Instant message delivery using Socket.IO
* Typing indicators
* Unread message notifications
* New message toast alerts
* Real-time communication between all workspace members

### 🎥 Google Meet Integration

* One-click meeting creation
* Workspace-wide meeting announcements
* Shared meeting links
* Active meeting banner
* Join meetings directly from the workspace

### 🔔 Activity Timeline

Track workspace activities including:

* New member joins
* Task assignments
* Task updates
* Note creation
* Meeting events

Features:

* Slide-in activity panel
* Unread activity indicator
* Real-time activity synchronization

### 🟢 Online Presence System

* Live online/offline tracking
* Real-time presence updates
* Online indicators for active members
* Socket-powered user status management

### 🔐 Authentication & Security

* JWT-based authentication
* Password hashing using bcryptjs
* Protected routes
* Secure workspace access
* Authorization middleware

---

## 🏗️ System Architecture

```text
┌─────────────────────┐
│    React + Vite     │
│      Frontend       │
└──────────┬──────────┘
           │
           │ REST APIs + Socket.IO
           ▼
┌─────────────────────┐
│  Node.js + Express  │
│      Backend        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ MongoDB + Mongoose  │
│      Database       │
└─────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Socket.IO Client
* Axios
* React Router DOM
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication
* bcryptjs
* node-cron

### Deployment

* Vercel (Frontend)
* MongoDB Atlas (Database)

---

## 📂 Project Structure

```text
TaskQube/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── utils/
│   ├── validators/
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        ├── components/
        │   ├── activity/
        │   ├── chat/
        │   ├── meet/
        │   ├── members/
        │   ├── note/
        │   └── task/
        ├── context/
        ├── pages/
        └── socket/
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js v18+
* MongoDB Atlas Account
* Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ananya324/TaskQube.git
cd TaskQube
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api

VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

---

### 4️⃣ Open the Application

```text
http://localhost:5173
```

---

## 📡 REST API Endpoints

### Authentication

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register user    |
| POST   | /api/auth/login    | Login user       |
| GET    | /api/auth/me       | Get current user |

---

### Workspaces

| Method | Endpoint                       | Description         |
| ------ | ------------------------------ | ------------------- |
| POST   | /api/workspaces                | Create workspace    |
| GET    | /api/workspaces                | Get user workspaces |
| POST   | /api/workspaces/join           | Join workspace      |
| GET    | /api/workspaces/:id            | Get workspace       |
| GET    | /api/workspaces/:id/activities | Get activities      |

---

### Tasks

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| POST   | /api/tasks                | Create task         |
| GET    | /api/tasks/:workspaceId   | Get workspace tasks |
| PUT    | /api/tasks/:taskId/status | Update task status  |
| DELETE | /api/tasks/:taskId        | Delete task         |

---

### Notes

| Method | Endpoint                | Description |
| ------ | ----------------------- | ----------- |
| POST   | /api/notes              | Create note |
| GET    | /api/notes/:workspaceId | Get notes   |
| PUT    | /api/notes/:noteId      | Update note |
| DELETE | /api/notes/:noteId      | Delete note |

---

### Messages

| Method | Endpoint                   | Description  |
| ------ | -------------------------- | ------------ |
| POST   | /api/messages              | Send message |
| GET    | /api/messages/:workspaceId | Get messages |

---

## ⚡ Socket.IO Events

### Client → Server

| Event          |
| -------------- |
| join-workspace |
| task-created   |
| task-updated   |
| task-deleted   |
| note-updated   |
| send-message   |
| typing         |
| user-online    |
| start-meet     |
| meet-ended     |

### Server → Client

| Event           |
| --------------- |
| new-task        |
| update-task     |
| delete-task     |
| receive-message |
| online-users    |
| meet-started    |
| new-activity    |

---

## 🔥 Engineering Challenges Solved

### Real-Time Synchronization

Implemented Socket.IO room-based communication to ensure all workspace members receive updates instantly without refreshing the page.

### Online Presence Tracking

Built a live presence system that tracks active users and updates member status in real time.

### Team Collaboration

Synchronized tasks, notes, meetings, chat messages, and activities across multiple connected users.

### Workspace Isolation

Used dedicated Socket.IO rooms and workspace-specific APIs to keep communication and data isolated between workspaces.

### Authentication & Authorization

Implemented JWT-based authentication and role-based controls to secure workspace operations.

---

## 📈 Key Highlights

* Full-stack MERN application
* Real-time communication with Socket.IO
* JWT Authentication
* Role-based workspace management
* Live activity tracking
* Online presence system
* Google Meet integration
* Responsive UI
* Modular and scalable architecture
* RESTful API design

---

## 🔮 Future Improvements

* Task Comments
* File Uploads
* Workspace Analytics
* Calendar Integration
* Email Notifications
* Dark Mode
* Task Recurring Schedules
* Voice Channels
* Workspace Template 
