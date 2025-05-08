# Kanban Board Clone

A Kanban board application built with Next.js, Express, MongoDB and Tailwind CSS.

## Project Overview

This project is a Kanban board application that allows users to organize tasks into boards and lists. It features a modern, responsive UI with dark/light mode support and a complete backend REST API with real-time updates.

## Repository Structure

```
├── frontend/         # Next.js frontend application
└── backend/          # Express.js REST API
```

## Features

-   User authentication (login/register)
-   Create and manage Kanban boards
-   Create lists within boards
-   Add, edit, and delete tasks
-   Team collaboration with multiple users
-   Drag and drop functionality for tasks
-   Real-time updates via WebSockets
-   Task assignment to board members
-   Task prioritization and status tracking
-   Task comments and activity logs
-   List reordering
-   Dark/light mode support
-   Responsive design for mobile and desktop

## Technology Stack

### Frontend

-   Framework: Next.js 15
-   Language: TypeScript
-   State Management: React Query (TanStack Query)
-   Real-time Updates: Socket.io client
-   Styling: Tailwind CSS, Shadcn/ui UI components
-   Form Management: React Hook Form with Zod validation
-   Authentication: JWT-based auth

### Backend

-   Framework: Express.js
-   Database: MongoDB with Mongoose
-   Authentication: JWT with bcrypt
-   API Documentation: Swagger/OpenAPI
-   Real-time Communication: Socket.io

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   MongoDB instance (local or remote)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The API will be available at http://localhost:5000  
API Documentation: http://localhost:5000/api-docs

## Project Architecture

### Frontend

The frontend follows a feature-sliced architecture with:

-   Entities: Core business logic and data structures
    -   Models for tasks, boards, lists, users, and members
    -   TanStack Query hooks for data fetching
-   Features: UI components tied to specific functionalities
    -   Auth features (login, register)
    -   Board management features
    -   Task management features
    -   Realtime updates via Socket.io
-   Shared: Reusable components and utilities
-   Pages: Main application views
-   Widgets: Complex UI components composed of multiple features

### Backend

The backend follows a 3-layered architecture:

1. Controllers: Handle HTTP requests and responses
2. Services: Contain business logic
3. Models: Define data structures using Mongoose schemas

## Realtime Features

The application supports real-time updates via WebSockets using Socket.io:

-   Board updates propagate instantly to all connected users
-   Task creation, updates, and deletions are synchronized in real-time
-   List reordering is reflected for all board members immediately
-   Task assignments and comments are updated in real-time
-   Connection status indicator for users

## License

[MIT License](LICENSE)
