# 🔌 API Reference

*🌍 [Tiếng Việt](api-contract.vi.md)*

This document specifies the REST API contract for the Debt Reminder System. 
The API strictly follows RESTful conventions and returns consistent JSON responses.

---

## 1. Authentication
All endpoints (except `/api/auth/login`) require a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 2. Standard Response Formats

**Success Response (HTTP 200)**
```json
{
  "success": true,
  "data": { ... } // Payload data goes here
}
```

**Error Response (HTTP 400, 401, 403, 500)**
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

---

## 3. Endpoints

### 3.1. Authentication
#### `POST /api/auth/login`
- **Request Body**:
  ```json
  { "email": "admin@example.com", "password": "admin123" }
  ```
- **Response**: Returns a `token` and `user` object.

### 3.2. Customers
#### `GET /api/customers`
- **Description**: Retrieves a paginated list of customers (Limit 100).
- **Response**: `[ { "id": "cus_123", "full_name": "John Doe", ... } ]`

#### `POST /api/customers`
- **Request Body**:
  ```json
  { "full_name": "John Doe", "email": "john@example.com", "phone": "123456789" }
  ```
- **Response**: `{ "id": "cus_123" }`

#### `DELETE /api/customers/:id`
- **Description**: Permanently deletes a customer.

### 3.3. Receivables (Debts)
#### `GET /api/receivables`
- **Description**: Retrieves a list of debts. Supports `?status=pending` query parameter.

#### `POST /api/receivables`
- **Request Body**:
  ```json
  { "customer_id": "cus_123", "amount": 5000, "currency": "USD", "due_date": "2024-12-31T00:00:00Z" }
  ```

#### `POST /api/receivables/:id/mark-paid`
- **Description**: Marks a specific debt as fully paid.

### 3.4. Rules & Templates
- `GET /api/templates` - List all email templates.
- `POST /api/templates` - Create a new email template.
- `GET /api/rules` - List all reminder rules.
- `POST /api/rules` - Create a new reminder rule.

---

> [!NOTE]
> Detailed schema definitions (Zod schemas) can be found in the `packages/shared/src/schemas.ts` file in the repository.
