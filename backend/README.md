# Kanban Board API

REST API backend for a Kanban board project using Express.js and MongoDB.

## Project Structure

```
└── src/
    ├── config/         # Configuration files
    ├── controllers/    # Route controllers
    ├── middleware/     # Custom middleware
    ├── models/         # Mongoose models
    ├── routes/         # API routes
    ├── services/       # Business logic
    └── server.js       # Entry point
```


## API Endpoints


More endpoints will be added as the project develops.

## Architecture

This project follows a 3-layered architecture:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Contain business logic 
3. **Models**: Define data structures using Mongoose schemas

## Development

When extending the API:

1. Create a new model in `models/`
2. Create a new service in `services/` (can extend BaseService)
3. Create a new controller in `controllers/` (can extend BaseController)
4. Create new route file in `routes/` and import it in `routes/index.js` 