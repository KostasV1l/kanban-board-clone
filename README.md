# Kanban Board Clone

A Kanban board application built with Next.js, Express, MongoDB and Tailwind CSS.

## Project Overview

This project is a Kanban board application that allows users to organize tasks into boards and lists. It features a modern, responsive UI with dark/light mode support and a complete backend REST API.

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
-   Drag and drop functionality for tasks
-   Dark/light mode support
-   Responsive design for mobile and desktop

## Technology Stack

### Frontend

-   **Framework**: Next.js 15
-   **Language**: TypeScript
-   **State Management**: React Query
-   **Styling**: Tailwind CSS, Shadcn/ui UI components
-   **Authentication**: JWT-based auth

### Backend

-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose
-   **Authentication**: JWT with bcrypt
-   **API Documentation**: Swagger/OpenAPI


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

The frontend follows a feature-based architecture with:

-   Entities: Core business logic and data structures
-   Features: UI components tied to specific functionalities
-   Shared: Reusable components and utilities
-   Pages: Main application views

### Backend

The backend follows a 3-layered architecture:

1. Controllers: Handle HTTP requests and responses
2. Services: Contain business logic
3. Models: Define data structures using Mongoose schemas

## License

[MIT License](LICENSE)
