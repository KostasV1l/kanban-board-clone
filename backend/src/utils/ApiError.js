class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// 400 - Bad Request: Invalid inputs, missing required fields
class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

// 401 - Unauthorized: Authentication failures
class UnauthorizedError extends ApiError {
    constructor(message = 'Authentication required') {
        super(401, message);
    }
}

// 403 - Forbidden: Authorization failures
class ForbiddenError extends ApiError {
    constructor(message = 'Access forbidden') {
        super(403, message);
    }
}

// 404 - Not Found: Resource not found
class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
}

// 409 - Conflict: Resource already exists or conflict
class ConflictError extends ApiError {
    constructor(message = 'Resource conflict', metadata = null) {
        super(409, message);
        this.metadata = metadata; // For storing additional info (like the existing membership)
    }
}

// 422 - Unprocessable Entity: Valid request but semantic errors
class ValidationError extends ApiError {
    constructor(message = 'Validation failed', errors = {}) {
        super(422, message);
        this.errors = errors; // For storing validation details
    }
}

// 429 - Too Many Requests: Rate limiting
class TooManyRequestsError extends ApiError {
    constructor(message = 'Too many requests, please try again later') {
        super(429, message);
    }
}

// Authentication specific
class InvalidCredentialsError extends UnauthorizedError {
    constructor(message = 'Invalid email or password') {
        super(message);
    }
}

class TokenError extends UnauthorizedError {
    constructor(message = 'Invalid or expired token') {
        super(message);
    }
}

class CSRFError extends ForbiddenError {
    constructor(message = 'CSRF validation failed') {
        super(message);
    }
}

class BoardAccessError extends ForbiddenError {
    constructor(message = 'You do not have access to this board') {
        super(message);
    }
}

class BoardNotFoundError extends NotFoundError {
    constructor(message = 'Board not found') {
        super(message);
    }
}

class ListNotFoundError extends NotFoundError {
    constructor(message = 'List not found') {
        super(message);
    }
}

class TaskNotFoundError extends NotFoundError {
    constructor(message = 'Task not found') {
        super(message);
    }
}

class UserNotFoundError extends NotFoundError {
    constructor(message = 'User not found') {
        super(message);
    }
}

class UserExistsError extends ConflictError {
    constructor(message = 'User already exists with this email') {
        super(message);
    }
}

class MemberExistsError extends ConflictError {
    constructor(message = 'User is already a member of this board', membership = null) {
        super(message);
        this.membership = membership;
    }
}

module.exports = {
    ApiError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
    TooManyRequestsError,
    InvalidCredentialsError,
    TokenError,
    CSRFError,
    BoardAccessError,
    BoardNotFoundError,
    ListNotFoundError,
    TaskNotFoundError,
    UserNotFoundError,
    UserExistsError,
    MemberExistsError
};

