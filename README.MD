# Calx: API to practice BE development
## Demo: [Link]()
## Collection: [API](https://documenter.getpostman.com/view/2000788/2sB3BBqrsV)
### Admin credentials: 
- ceo@calx.com
- Aa123456

## Technologies  
  - [x] NodeJS
  - [x] ExpressJS
  - [x] Mongoose

## APIs
  - [x] Invoices
    - [x] Get All
    - [x] Get by id
    - [x] Create
    - [x] Update
    - [x] Delete

  - [x] Auth
    - [x] Login
    - [ ] Logout
    - [x] SignUp
  
  - [x] Users (Permission based)
    - [x] Get All Users (Admin only)
    - [x] Get User by ID (Admin only)
    - [x] Update User (Admin only)
    - [x] Delete User (Admin only)

## Features
  - [x] Global error handler
  - [x] Async / await handler
  - [x] Versioning structure
  - [x] Base response schema
  - [x] EsLint
  - [x] JWT Authentication
  - [x] Role-based Authorization
  - [x] Password Hashing with bcrypt

### Creation date: _04/08/2025_

## Authentication & Authorization

### User Model

The User model includes the following fields:

```javascript
{
  name: String,           // Required, max 20 characters
  email: String,          // Required, unique, validated
  role: String,           // Enum: 'user', 'admin' (default: 'user')
  password: String,       // Required, min 8 chars, hashed
  passwordConfirm: String, // Required, must match password
  passwordChangedAt: Date, // Auto-set when password changes
  active: Boolean         // Default: true
}
```

### User Roles

- **`user`**: Standard user role with basic permissions
- **`admin`**: Administrator role with full system access

### Authentication Middleware

#### `authenticateUser` Middleware

Validates JWT tokens and authenticates users for protected routes.

**Functionality:**
- Extracts Bearer token from Authorization header
- Verifies JWT token using `JWT_SECRET`
- Checks if user still exists in database
- Attaches user object to request (`req.user`)

**Usage:**
```javascript
const { authenticateUser } = require('../middlewares/auth.middleware');

// Protect a single route
router.get('/protected', authenticateUser, controllerFunction);

// Protect all routes in a router
router.use(authenticateUser);
```

**Error Responses:**
- `401 Unauthorized`: No token provided or invalid token
- `401 Unauthorized`: User no longer exists

#### `restrictTo` Middleware

Role-based authorization middleware that restricts access based on user roles.

**Functionality:**
- Checks if user's role is included in allowed roles array
- Must be used after `authenticateUser` middleware
- Returns 403 Forbidden if user lacks required permissions

**Usage:**
```javascript
const { restrictTo } = require('../middlewares/auth.middleware');
const { UserRoles } = require('../services/staticLookups');

// Restrict to admin only
router.use(restrictTo([UserRoles.ADMIN]));

// Restrict to specific roles
router.get('/admin-only', restrictTo(['admin', 'moderator']), controllerFunction);
```


### Authentication Flow

1. **Login/Signup**: User authenticates and receives JWT token
2. **Protected Route Access**: 
   - Client includes `Authorization: Bearer <token>` header
   - `authenticateUser` middleware validates token and user
   - `restrictTo` middleware checks user permissions
   - Route handler executes if authorized

### Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
- **JWT Tokens**: Stateless authentication using JSON Web Tokens
- **Role-based Access Control**: Fine-grained permission system
- **Input Validation**: Email validation and password confirmation
- **Password History**: Tracks password change timestamps

## Get All invoices API Documentation

### Handler Factory - getAll Function

The `getAll` function is a generic handler factory that provides standardized pagination, filtering, sorting, and field selection for retrieving multiple documents from any MongoDB collection.

#### Function Signature
```javascript
const getAll = (Model) => catchAsync(async (req, res, next) => { ... })
```

#### Parameters
- `Model` (Mongoose Model): The Mongoose model to query against

#### Dependencies

##### 1. APIFeatures Class (`utils/apiFeatures.js`)
A utility class that provides advanced query features for MongoDB operations.

**Methods:**
- **`filter()`**: Filters documents based on query parameters
  - Excludes pagination, sorting, and field selection parameters
  - Supports MongoDB comparison operators: `gte`, `gt`, `lte`, `lt`
  - Example: `?price[gte]=100&status=active`

- **`sort()`**: Sorts results by specified fields
  - Default sort: `-createdAt` (newest first)
  - Supports multiple fields: `?sort=price,-createdAt`
  - Comma-separated values are converted to space-separated

- **`limitFields()`**: Selects specific fields to return
  - Default: excludes `__v` field
  - Supports field selection: `?fields=name,price,status`
  - Comma-separated values are converted to space-separated

- **`paginate()`**: Implements pagination
  - Default: page 1, limit 10 items per page
  - Query parameters: `?page=2&limit=20`
  - Calculates skip value: `(page - 1) * limit`


##### 3. catchAsync Function (`utils/catchAsync.js`)
Error handling wrapper for async route handlers.

**Functionality:**
- Wraps async functions to catch errors
- Automatically passes errors to Express error handling middleware
- Eliminates need for try-catch blocks in route handlers

#### Usage Example

```javascript
// In route file
const { getAll } = require('../services/handlerFactory');
const Invoice = require('../models/v1/invoice.model');

router.get('/invoices', getAll(Invoice));
```

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number for pagination | `?page=2` |
| `limit` | number | Items per page | `?limit=20` |
| `sort` | string | Sort fields (comma-separated) | `?sort=price,-createdAt` |
| `fields` | string | Select fields (comma-separated) | `?fields=name,price,status` |
| `[field]` | any | Filter by field value | `?status=active` |
| `[field][gte]` | number | Greater than or equal | `?price[gte]=100` |
| `[field][gt]` | number | Greater than | `?price[gt]=100` |
| `[field][lte]` | number | Less than or equal | `?price[lte]=500` |
| `[field][lt]` | number | Less than | `?price[lt]=500` |

#### Response Format

```javascript
{
  "isSuccess": true,
  "httpCode": 200,
  "data": {
    "items": [
      // Array of documents
    ],
    "totalCount": 150
  },
  "errors": []
}
```

#### Example API Calls

1. **Basic pagination:**
   ```
   GET /api/v1/invoices?page=2&limit=10
   ```

2. **Filtering and sorting:**
   ```
   GET /api/v1/invoices?status=active&sort=price,-createdAt&fields=name,price,status
   ```

3. **Range filtering:**
   ```
   GET /api/v1/invoices?price[gte]=100&price[lte]=500&status=active
   ```