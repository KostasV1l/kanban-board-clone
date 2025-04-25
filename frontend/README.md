# Kanban Board Clone - Frontend

A modern Kanban board application frontend built with Next.js and Tailwind CSS.

## Project Overview

This project is the frontend for a Kanban board application that allows users to organize tasks into boards and lists. It features a modern, responsive UI with dark/light mode support and connects to a REST API backend.

## Features

- User authentication (login/register)
- Create and manage Kanban boards
- Create lists within boards
- Add, edit, and delete tasks
- Dark/light mode support
- Responsive design for mobile and desktop
- Real-time updates with React Query
- Form validation with Zod and React Hook Form

## Technology Stack

- **Framework**: Next.js 14.2.3
- **Language**: TypeScript
- **State Management**: React Query v5 (TanStack Query) & Zustand
- **Styling**: Tailwind CSS v4, Shadcn/ui components with Radix UI
- **Authentication**: JWT-based auth
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
- **Features**: Implementation of specific use cases
    - auth: Login and registration forms
- **Pages**: Page components and routing
    - DashboardPage: Main application dashboard
    - HomePage: Landing page
    - Login: Authentication page
- **Components**:
    - UI components built with Shadcn/ui and Radix primitives
    - Dashboard-specific components (board-header, board-list, etc.)
    - Theme components for dark/light mode support
- **Shared**: API clients and query utilities
- **Hooks**: Custom React hooks for shared functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
