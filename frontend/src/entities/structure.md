# Entities Layer Structure

In our Feature-Sliced Design architecture, the entities layer contains the core business entities of our application. These are the fundamental data models that represent our business domain and are used across different features and pages.

## Architecture Overview

The entities layer follows a modular approach, where each entity (such as auth, board, task) is encapsulated in its own directory with a consistent internal structure. This organization promotes code reusability and maintainability, allowing developers to easily locate and work with specific business entities.

## Model Directory Structure

The `/model` directory is the heart of each entity, containing all the logic and types related to that business entity. We've organized this directory into several focused files, each with a specific responsibility:

### `types.ts` - The Foundation

- Defines TypeScript interfaces and types for the entity
- Contains all data models and type definitions used across the entity
- Avoids business logic, focusing only on type definitions
- Serves as the foundation upon which all other files are built

### `api.ts` - Communication Layer

- Contains API client functions for interacting with backend services
- Implements CRUD operations and other API-related functionality
- Handles API request formatting and response parsing
- May include mock data for development and testing purposes

### `keys.ts` - Cache Management

- Defines TanStack Query keys for data fetching and cache management
- Implements a hierarchical structure for organized cache invalidation
- Provides type-safe query key definitions with proper TypeScript typing
- Acts as a bridge between raw API calls and Tanstack Query hooks

### `queries.ts` - Server State Management

- Contains Tanstack Query hooks for data fetching, mutations, and cache management
- Implements hooks that leverage TanStack Query for server state management
- Handles loading, error, and success states for API operations
- Manages cache invalidation and updates when data changes

### `hooks.ts` - Local State Management

- Contains traditional React hooks using useState/useEffect for local state management
- Implements custom hooks that abstract away complex state logic
- Provides alternative state management that doesn't rely on Tanstack Query
- Handles UI state that doesn't need to be cached globally

### `index.ts` - Public API

- Re-exports all components from the model directory
- Provides a clean public API for importing from other parts of the application
- Helps maintain encapsulation by controlling what gets exported
- Simplifies imports with a single entry point

## Entity API Reference

The data flow within each entity is designed to be clear and consistent.
The flow of data typically follows this pattern:

> User → UI element → element Model → Shared API → Entity Queries → Entity API → Backend Server

For example, in the case of authentication, the flow would be:

> User → Form UI → Form Model → Shared API → Entity Queries → Entity API → Backend Server

Below is a comprehensive reference of all entities, their types, API methods, and hooks for quick access.

### Auth Entity

#### Types

| Type               | Description                          | Properties                                              |
| ------------------ | ------------------------------------ | ------------------------------------------------------- |
| `AuthResponse`     | Server response for auth operations  | `token: string`, `user: { id, email }`                  |
| `RegisterFormData` | Data structure for user registration | `username: string`, `email: string`, `password: string` |

#### API Methods

| Method            | Signature                                           | Description                              | Returns                 |
| ----------------- | --------------------------------------------------- | ---------------------------------------- | ----------------------- |
| `login`           | `(data: LoginFormData) => Promise<AuthResponse>`    | Authenticates a user and returns a token | `Promise<AuthResponse>` |
| `register`        | `(data: RegisterFormData) => Promise<AuthResponse>` | Registers a new user                     | `Promise<AuthResponse>` |
| `getCurrentUser`  | `() => Promise<AuthResponse["user"] \| null>`       | Gets the current logged-in user          | `Promise<User \| null>` |
| `logout`          | `() => Promise<void>`                               | Logs out the current user                | `Promise<void>`         |
| `getToken`        | `() => string \| null`                              | Gets the stored auth token               | `string \| null`        |
| `isAuthenticated` | `() => boolean`                                     | Checks if the user is authenticated      | `boolean`               |

#### Tanstack Query Hooks

| Hook             | Purpose                             | Parameters | Returns             |
| ---------------- | ----------------------------------- | ---------- | ------------------- |
| `useLogin`       | Mutation hook for user login        | -          | `UseMutationResult` |
| `useRegister`    | Mutation hook for user registration | -          | `UseMutationResult` |
| `useCurrentUser` | Query hook to get the current user  | -          | `UseQueryResult`    |
| `useLogout`      | Mutation hook for user logout       | -          | `UseMutationResult` |

#### Traditional React Hooks

| Hook            | Purpose                             | Parameters | Returns                                                |
| --------------- | ----------------------------------- | ---------- | ------------------------------------------------------ |
| `useAuthStatus` | Hook to check authentication status | -          | `{ isAuthenticated, loading, error, checkAuthStatus }` |

### Board Entity

#### Types

| Type    | Description                           | Properties                                                                                  |
| ------- | ------------------------------------- | ------------------------------------------------------------------------------------------- |
| `Board` | Represents a board in the application | `id: number`, `name: string`, `description: string`, `color: string`, `tasksCount?: number` |

#### API Methods

| Method        | Signature                                      | Description               | Returns                       |
| ------------- | ---------------------------------------------- | ------------------------- | ----------------------------- |
| `getBoards`   | `() => Promise<Board[]>`                       | Gets all boards           | `Promise<Board[]>`            |
| `getBoard`    | `(id: number) => Promise<Board \| undefined>`  | Gets a specific board     | `Promise<Board \| undefined>` |
| `createBoard` | `(board: Omit<Board, "id">) => Promise<Board>` | Creates a new board       | `Promise<Board>`              |
| `updateBoard` | `(boardData: Board) => Promise<Board>`         | Updates an existing board | `Promise<Board>`              |
| `deleteBoard` | `(id: number) => Promise<boolean>`             | Deletes a board           | `Promise<boolean>`            |

#### Tanstack Query Hooks

| Hook             | Purpose                         | Parameters   | Returns             |
| ---------------- | ------------------------------- | ------------ | ------------------- |
| `useBoards`      | Query hook to get all boards    | -            | `UseQueryResult`    |
| `useBoard`       | Query hook to get a board       | `id: number` | `UseQueryResult`    |
| `useCreateBoard` | Mutation hook to create a board | -            | `UseMutationResult` |
| `useUpdateBoard` | Mutation hook to update a board | -            | `UseMutationResult` |
| `useDeleteBoard` | Mutation hook to delete a board | -            | `UseMutationResult` |

#### Traditional React Hooks

| Hook            | Purpose                                | Parameters   | Returns                                                          |
| --------------- | -------------------------------------- | ------------ | ---------------------------------------------------------------- |
| `useBoardsList` | Hook to manage boards with local state | -            | `{ boards, loading, error, addBoard, updateBoard, deleteBoard }` |
| `useBoardState` | Hook to get a specific board           | `id: number` | `{ board, loading, error }`                                      |

### List Entity

#### Types

| Type            | Description                                  | Properties                                                                                  |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `List`          | Represents a list/column in a board          | `id: number`, `name: string`, `boardId: number`, `position: number`, `color?: string`, etc. |
| `CreateListDto` | Data structure for creating a new list       | `name: string`, `boardId: number`, `position?: number`, `color?: string`                    |
| `UpdateListDto` | Data structure for updating an existing list | `name?: string`, `position?: number`, `color?: string`                                      |

#### API Methods

| Method         | Signature                                                 | Description                   | Returns           |
| -------------- | --------------------------------------------------------- | ----------------------------- | ----------------- |
| `getLists`     | `(boardId: number) => Promise<List[]>`                    | Gets all lists for a board    | `Promise<List[]>` |
| `getList`      | `(id: number) => Promise<List>`                           | Gets a specific list          | `Promise<List>`   |
| `createList`   | `(data: CreateListDto) => Promise<List>`                  | Creates a new list            | `Promise<List>`   |
| `updateList`   | `(id: number, data: UpdateListDto) => Promise<List>`      | Updates an existing list      | `Promise<List>`   |
| `deleteList`   | `(id: number) => Promise<void>`                           | Deletes a list                | `Promise<void>`   |
| `reorderLists` | `(boardId: number, listIds: number[]) => Promise<List[]>` | Reorders lists within a board | `Promise<List[]>` |

#### Tanstack Query Hooks

| Hook              | Purpose                             | Parameters        | Returns             |
| ----------------- | ----------------------------------- | ----------------- | ------------------- |
| `useGetLists`     | Query hook to get lists for a board | `boardId: number` | `UseQueryResult`    |
| `useGetList`      | Query hook to get a specific list   | `id: number`      | `UseQueryResult`    |
| `useCreateList`   | Mutation hook to create a list      | -                 | `UseMutationResult` |
| `useUpdateList`   | Mutation hook to update a list      | -                 | `UseMutationResult` |
| `useDeleteList`   | Mutation hook to delete a list      | -                 | `UseMutationResult` |
| `useReorderLists` | Mutation hook to reorder lists      | -                 | `UseMutationResult` |

#### Traditional React Hooks

| Hook                | Purpose                                      | Parameters             | Returns                                                                            |
| ------------------- | -------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------- |
| `useListReordering` | Hook to manage list reordering via drag/drop | `initialLists: List[]` | `{ lists, isDragging, startDrag, endDrag, reorderList, addList, updateList, ... }` |

### Task Entity

#### Types

| Type         | Description                          | Properties                                                                                         |
| ------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `Task`       | Represents a task in the application | `id, title, description, boardId, columnId, priority, dueDate?, createdAt, updatedAt, assignedTo?` |
| `TaskColumn` | Enum for task columns                | `BACKLOG = 1, TODO = 2, IN_PROGRESS = 3, DONE = 4`                                                 |

#### API Methods

| Method       | Signature                                                                 | Description                | Returns                      |
| ------------ | ------------------------------------------------------------------------- | -------------------------- | ---------------------------- |
| `getTasks`   | `(boardId: number) => Promise<Task[]>`                                    | Gets tasks for a board     | `Promise<Task[]>`            |
| `getTask`    | `(id: number) => Promise<Task \| undefined>`                              | Gets a specific task       | `Promise<Task \| undefined>` |
| `createTask` | `(task: Omit<Task, "id" \| "createdAt" \| "updatedAt">) => Promise<Task>` | Creates a task             | `Promise<Task>`              |
| `updateTask` | `(taskData: Partial<Task> & { id: number }) => Promise<Task>`             | Updates a task             | `Promise<Task>`              |
| `moveTask`   | `(taskId: number, columnId: number) => Promise<Task>`                     | Moves task to a new column | `Promise<Task>`              |
| `deleteTask` | `(id: number) => Promise<boolean>`                                        | Deletes a task             | `Promise<boolean>`           |

#### Tanstack Query Hooks

| Hook            | Purpose                             | Parameters        | Returns             |
| --------------- | ----------------------------------- | ----------------- | ------------------- |
| `useBoardTasks` | Query hook to get tasks for a board | `boardId: number` | `UseQueryResult`    |
| `useTask`       | Query hook to get a specific task   | `id: number`      | `UseQueryResult`    |
| `useCreateTask` | Mutation hook to create a task      | -                 | `UseMutationResult` |
| `useUpdateTask` | Mutation hook to update a task      | -                 | `UseMutationResult` |
| `useMoveTask`   | Mutation hook to move a task        | -                 | `UseMutationResult` |
| `useDeleteTask` | Mutation hook to delete a task      | -                 | `UseMutationResult` |

#### Traditional React Hooks

| Hook                | Purpose                                | Parameters        | Returns                                                                |
| ------------------- | -------------------------------------- | ----------------- | ---------------------------------------------------------------------- |
| `useBoardTasksList` | Hook to manage tasks with local state  | `boardId: number` | `{ tasks, loading, error, addTask, updateTask, moveTask, deleteTask }` |
| `useTaskDetails`    | Hook to get details of a specific task | `id: number`      | `{ task, loading, error }`                                             |

## Data Flow

The typical data flow within an entity follows this pattern:

1. Types define the shape of the data
2. API functions communicate with the backend
3. Query keys organize the data cache
4. Tanstack Query hooks use API functions and keys to manage server state
5. Traditional hooks manage local state when needed
6. Everything is exported via index.ts for use in features and pages

## Usage Examples

Below are examples of how to use the hooks from each entity to fetch data in your components.

### Auth Entity Examples

#### Using Tanstack Query Hooks

```tsx
import { useCurrentUser, useLogin } from "@/entities/auth";

const UserProfile = () => {
    // Fetch current user data
    const { data: user, isLoading, error } = useCurrentUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading user: {error.message}</div>;

    return (
        <div>
            <h1>Welcome, {user?.email}</h1>
            {/* Rest of profile component */}
        </div>
    );
};

const LoginComponent = () => {
    // Set up login mutation
    const { mutate: login, isLoading, error } = useLogin();

    const handleSubmit = data => {
        login(data, {
            onSuccess: response => {
                console.log("Login successful", response);
                // Navigate or update UI
            },
        });
    };

    return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
};
```

#### Using Traditional React Hooks

```tsx
import { useAuthStatus } from "@/entities/auth";

const AuthGuard = ({ children }) => {
    const { isAuthenticated, loading, error } = useAuthStatus();

    if (loading) return <div>Checking authentication...</div>;
    if (error) return <div>Authentication error: {error.message}</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return children;
};
```

### Board Entity Examples

#### Using Tanstack Query Hooks

```tsx
import { useBoard, useBoards, useCreateBoard } from "@/entities/board";

const BoardsList = () => {
    // Fetch all boards
    const { data: boards, isLoading, error } = useBoards();

    if (isLoading) return <div>Loading boards...</div>;
    if (error) return <div>Error loading boards: {error.message}</div>;

    return (
        <div>
            <h1>Your Boards</h1>
            <ul>{boards?.map(board => <li key={board.id}>{board.name}</li>)}</ul>
        </div>
    );
};

const BoardDetails = ({ boardId }) => {
    // Fetch a specific board
    const { data: board, isLoading, error } = useBoard(boardId);

    if (isLoading) return <div>Loading board details...</div>;
    if (error) return <div>Error loading board: {error.message}</div>;

    return (
        <div>
            <h1>{board?.name}</h1>
            <p>{board?.description}</p>
            {/* Rest of board details */}
        </div>
    );
};

const CreateBoardForm = () => {
    // Set up create board mutation
    const { mutate: createBoard, isLoading } = useCreateBoard();

    const handleSubmit = data => {
        createBoard(data, {
            onSuccess: newBoard => {
                console.log("Board created:", newBoard);
                // Navigate or update UI
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Board"}
            </button>
        </form>
    );
};
```

#### Using Traditional React Hooks

```tsx
import { useBoardsList, useBoardState } from "@/entities/board";

const BoardManagerComponent = () => {
    const { boards, loading, error, addBoard, updateBoard, deleteBoard } = useBoardsList();

    if (loading) return <div>Loading boards...</div>;

    return (
        <div>
            <h1>Manage Your Boards</h1>
            {error && <div className="error">{error}</div>}

            <button onClick={() => addBoard({ name: "New Board", description: "", color: "#ff9900" })}>
                Add Board
            </button>

            <ul>
                {boards?.map(board => (
                    <li key={board.id}>
                        {board.name}
                        <button onClick={() => updateBoard({ ...board, name: "Updated Name" })}>Edit</button>
                        <button onClick={() => deleteBoard(board.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
```

### List Entity Examples

#### Using Tanstack Query Hooks

```tsx
import { useCreateList, useGetLists, useReorderLists } from "@/shared/api/list";

const BoardLists = ({ boardId }) => {
    // Fetch all lists for a board
    const { data: lists, isLoading, error } = useGetLists(boardId);
    const createListMutation = useCreateList();
    const reorderListsMutation = useReorderLists();

    if (isLoading) return <div>Loading lists...</div>;
    if (error) return <div>Error loading lists: {error.message}</div>;

    const handleCreateList = () => {
        createListMutation.mutate({
            name: "New List",
            boardId: boardId,
            position: lists?.length || 0,
        });
    };

    const handleReorder = (sourceIndex, destinationIndex) => {
        // Create a new array representing the reordered lists
        const reorderedLists = [...lists];
        const [removed] = reorderedLists.splice(sourceIndex, 1);
        reorderedLists.splice(destinationIndex, 0, removed);

        // Get the IDs in the new order
        const listIds = reorderedLists.map(list => list.id);

        // Call the reorder mutation
        reorderListsMutation.mutate({
            boardId,
            listIds,
        });
    };

    return (
        <div className="board-lists">
            <h2>Lists</h2>
            <button onClick={handleCreateList}>Add New List</button>

            <div className="lists-container">
                {lists?.map((list, index) => (
                    <div
                        key={list.id}
                        className="list-column"
                        style={{ borderTop: `3px solid ${list.color || "#ccc"}` }}
                    >
                        <h3>{list.name}</h3>
                        <div className="tasks-container">{/* Tasks would be rendered here */}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
```

#### Using Traditional React Hooks

```tsx
import { useEffect } from "react";
import { listApi, useListReordering } from "@/shared/api/list";

const DraggableLists = ({ boardId }) => {
    const [listsData, setListsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the lists
    useEffect(() => {
        const fetchLists = async () => {
            try {
                setLoading(true);
                const data = await listApi.getLists(boardId);
                setListsData(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLists();
    }, [boardId]);

    // Use the list reordering hook
    const { lists, isDragging, startDrag, endDrag, reorderList, addList, updateList, removeList } =
        useListReordering(listsData);

    // Update when source data changes
    useEffect(() => {
        if (listsData.length > 0) {
            setLists(listsData);
        }
    }, [listsData]);

    const handleDragEnd = async result => {
        if (!result.destination) return;

        // Reorder locally
        const newOrder = reorderList(result.source.index, result.destination.index);

        // Save to server
        try {
            await listApi.reorderLists(boardId, newOrder);
        } catch (err) {
            console.error("Failed to reorder lists:", err);
            // Optionally restore original order
        }

        endDrag();
    };

    if (loading) return <div>Loading lists...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <DragDropContext onDragStart={startDrag} onDragEnd={handleDragEnd}>
            <Droppable droppableId="lists" direction="horizontal" type="LIST">
                {provided => (
                    <div className="lists-container" {...provided.droppableProps} ref={provided.innerRef}>
                        {lists.map((list, index) => (
                            <Draggable key={list.id} draggableId={`list-${list.id}`} index={index}>
                                {provided => (
                                    <div
                                        className="list-column"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <h3>{list.name}</h3>
                                        {/* Tasks would be rendered here */}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};
```

### Task Entity Examples

#### Using Tanstack Query Hooks

```tsx
import { useBoardTasks, useMoveTask, useTask } from "@/entities/task";

const TasksList = ({ boardId }) => {
    // Fetch tasks for a specific board
    const { data: tasks, isLoading, error } = useBoardTasks(boardId);

    if (isLoading) return <div>Loading tasks...</div>;
    if (error) return <div>Error loading tasks: {error.message}</div>;

    return (
        <div>
            <h2>Tasks</h2>
            <ul>{tasks?.map(task => <li key={task.id}>{task.title}</li>)}</ul>
        </div>
    );
};

const TaskDetails = ({ taskId }) => {
    // Fetch a specific task
    const { data: task, isLoading, error } = useTask(taskId);

    // Set up move task mutation
    const { mutate: moveTask } = useMoveTask();

    if (isLoading) return <div>Loading task details...</div>;
    if (error) return <div>Error loading task: {error.message}</div>;

    const handleMoveTask = newColumnId => {
        moveTask({ taskId: task.id, columnId: newColumnId });
    };

    return (
        <div>
            <h1>{task?.title}</h1>
            <p>{task?.description}</p>
            <div>
                <label>Move task to:</label>
                <select value={task?.columnId} onChange={e => handleMoveTask(Number(e.target.value))}>
                    <option value={1}>Backlog</option>
                    <option value={2}>Todo</option>
                    <option value={3}>In Progress</option>
                    <option value={4}>Done</option>
                </select>
            </div>
        </div>
    );
};
```

#### Using Traditional React Hooks

```tsx
import { useBoardTasksList, useTaskDetails } from "@/entities/task";

const TaskManager = ({ boardId }) => {
    const { tasks, loading, error, addTask, updateTask, moveTask, deleteTask } = useBoardTasksList(boardId);

    if (loading) return <div>Loading tasks...</div>;

    return (
        <div>
            <h2>Manage Tasks</h2>
            {error && <div className="error">{error}</div>}

            <button
                onClick={() =>
                    addTask({
                        title: "New Task",
                        description: "Task description",
                        boardId,
                        columnId: 1,
                        priority: "medium",
                    })
                }
            >
                Add Task
            </button>

            <div className="task-columns">
                {/* Task columns display with drag-and-drop functionality */}
                {tasks?.map(task => (
                    <div key={task.id} className="task-card">
                        <h3>{task.title}</h3>
                        <div className="task-actions">
                            <button onClick={() => moveTask(task.id, task.columnId + 1)}>Move Forward</button>
                            <button onClick={() => deleteTask(task.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SingleTaskView = ({ taskId }) => {
    const { task, loading, error } = useTaskDetails(taskId);

    if (loading) return <div>Loading task...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!task) return <div>Task not found</div>;

    return (
        <div className="task-detail-view">
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            <div className="metadata">
                <span>Priority: {task.priority}</span>
                <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
            </div>
        </div>
    );
};
```
