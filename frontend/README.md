# Kanban Board Clone - Frontend

A modern Kanban board application frontend built with Next.js and Tailwind CSS.

## Project Overview

This project is the frontend for a Kanban board application that allows users to organize tasks into boards and lists. It features a modern, responsive UI with dark/light mode support and connects to a REST API backend with real-time WebSocket integration.

## Features

- User authentication (login/register)
- Create and manage Kanban boards
- Create lists within boards
- Add, edit, and delete tasks
- Drag and drop for tasks and list reordering
- Real-time updates via Socket.io
- Task assignment to board members
- Task prioritization and status tracking
- Activity logs and commenting system
- Dark/light mode support
- Responsive design for mobile and desktop
- Form validation with Zod and React Hook Form
- Real-time connection status indicator

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **State Management**: React Query v5 (TanStack Query) & Zustand
- **Real-time Updates**: Socket.io client integration
- **Styling**: Tailwind CSS v4, Shadcn/ui components with Radix UI
- **Authentication**: JWT-based auth with refresh tokens
- **Form Management**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Themes**: Next-themes for dark/light mode
- **Drag and Drop**: React Beautiful DnD
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend API running (see backend README for setup)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at http://localhost:3000

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm run start
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Architecture

This project follows a feature-sliced architecture:

- **App**: Next.js application configuration and layouts
- **Entities**: Core business logic and data models
    - auth: Authentication state and API interactions
    - board: Board-related queries and types
    - list: List-related queries and types
    - task: Task-related queries and types
    - member: Board member management
- **Features**: Implementation of specific use cases
    - auth: Login and registration forms
    - board: Board creation and management
    - task: Task creation, editing, and management
    - realtime: WebSocket connection and event handling
- **Pages**: Page components and routing
    - DashboardPage: Main application dashboard
    - BoardPage: Board view with lists and tasks
    - HomePage: Landing page
    - Login: Authentication page
- **Components**:
    - UI components built with Shadcn/ui and Radix primitives
    - Dashboard-specific components (board-header, board-list, etc.)
    - Theme components for dark/light mode support
- **Shared**: API clients and query utilities
- **Hooks**: Custom React hooks for shared functionality
- **Widgets**: Complex UI components composed of multiple features
    - TaskDetailDialog: Modal for viewing and editing task details
    - BoardMembersPanel: Managing board members and permissions
    - DashboardPage: Components specific to the dashboard view

## Real-time Features

The application implements real-time updates using Socket.io:

- Live task updates across all connected clients
- Real-time list reordering with optimistic UI updates
- Live member presence and activity tracking
- Immediate task assignment notifications
- Connection status indicator
- Automatic reconnection handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
