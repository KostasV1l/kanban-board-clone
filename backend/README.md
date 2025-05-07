# Kanban Board API

REST API backend for a Kanban board project using Express.js, MongoDB, and Socket.io for real-time updates.

## Project Overview

This backend provides a comprehensive API for a Kanban board application, featuring user authentication, board management, task tracking, and real-time collaboration capabilities. It uses MongoDB for data persistence and Socket.io for real-time updates between clients.

## Features

- User authentication with JWT (login, register)
- Guest session support
- Board CRUD operations
- List and task management
- Board member management with roles and permissions
- Real-time updates via WebSockets
- Task assignments and comments
- List reordering
- Task prioritization and status tracking
- API documentation via Swagger

## Project Structure

```
└── src/
    ├── config/         # Configuration files (DB, socket.io, constants)
    ├── controllers/    # Route controllers for API endpoints
    ├── middleware/     # Custom middleware (auth, error handling)
    ├── models/         # Mongoose models for data entities
    ├── routes/         # API routes definition
    ├── services/       # Business logic and data operations
    ├── utils/          # Utility functions and helper methods
    └── server.js       # Entry point
```

## API Endpoints

The API is documented using Swagger/OpenAPI and can be accessed at `/api-docs` when the server is running.

Key endpoints include:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login an existing user
- `POST /auth/guest` - Create a guest session

### Boards
- `GET /boards` - Get all boards for the authenticated user
- `POST /boards` - Create a new board
- `GET /boards/{boardId}` - Get a specific board
- `PUT /boards/{boardId}` - Update a board
- `DELETE /boards/{boardId}` - Delete a board

### Lists
- `GET /boards/{boardId}/lists` - Get all lists for a board
- `POST /boards/{boardId}/lists` - Create a new list
- `PUT /boards/{boardId}/lists/{listId}` - Update a list
- `PATCH /boards/{boardId}/lists/reorder` - Reorder lists
- `DELETE /boards/{boardId}/lists/{listId}` - Delete a list

### Tasks
- `GET /boards/{boardId}/lists/{listId}/tasks` - Get all tasks in a list
- `POST /boards/{boardId}/lists/{listId}/tasks` - Create a new task
- `PUT /tasks/{taskId}` - Update a task
- `PATCH /tasks/{taskId}/move` - Move a task to a different list
- `DELETE /tasks/{taskId}` - Delete a task

### Members
- `GET /boards/{boardId}/members` - Get all members of a board
- `POST /boards/{boardId}/members` - Add a member to a board
- `PUT /boards/{boardId}/members/{memberId}` - Update a member's role
- `DELETE /boards/{boardId}/members/{memberId}` - Remove a member from a board

Full API documentation is available in the `docs/` directory and through the Swagger UI.

## Real-time Communication

The backend uses Socket.io to provide real-time updates to clients. Real-time events include:

- Board updates (created, updated, deleted)
- List updates (created, updated, deleted, reordered)
- Task updates (created, updated, deleted, moved, reordered)
- Member changes (added, updated, removed)
- User presence (online, offline)

Events are emitted to connected clients when changes occur, allowing for a collaborative experience.

## Architecture

This project follows a 3-layered architecture:

1. **Controllers**: Handle HTTP requests and responses
   - Parse incoming requests
   - Validate input data
   - Call appropriate service methods
   - Format responses

2. **Services**: Contain business logic
   - Implement core application logic
   - Handle database operations
   - Manage transactions
   - Emit Socket.io events

3. **Models**: Define data structures using Mongoose schemas
   - Define document structure and validation
   - Implement model methods and middleware
   - Handle relationships between entities

The Socket.io integration functions as a publish/subscribe mechanism where:
- Services emit events after successful operations
- Connected clients subscribe to relevant board rooms
- Events are broadcast to all clients in the same board room

## Development

When extending the API:

1. Create a new model in `models/`
2. Create a new service in `services/` (can extend BaseService)
3. Create a new controller in `controllers/` (can extend BaseController)
4. Create new route file in `routes/` and import it in `routes/index.js`
5. Update socket events in `utils/socketEvents.js` if real-time updates are needed

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas connection)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables
Create a `.env` file in the root directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kanban-board
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

## Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```