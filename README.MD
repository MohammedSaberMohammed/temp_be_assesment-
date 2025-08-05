# Calx: API to practice BE development
## Demo: [Link]()
## Collection: [API]()
## Technologies  
  - [x] NodeJS
  - [x] ExpressJS
  - [x] Mongoose

## APIs
  - [ ] Invoices
    - [x] Get All
    - [x] Get by id
    - [x] Create
    - [x] Update
    - [x] Delete

  - [ ] Auth ( Additional if I have time )
    - [x] Login
    - [ ] Logout
    - [x] SignUp
  
  - [ ] Users ( Additional if I have time ) / Permission based
    - [ ] Update
    - [ ] Delete (soft delete)
    - [ ] Get me ( Logged in person info )

## Features
  - [ ] Global error handler
  - [x] Async / await handler
  - [x] Versioning structure
  - [x] Base response schema
  - [x] EsLint

### Creation date: _04/08/2025_

## API Documentation

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