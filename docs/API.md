# Gulf Laser Tag — API Reference

Base URL: `http://localhost:{PORT}`

All responses are JSON unless otherwise noted. Error responses typically follow:

```json
{
  "message": "Error description",
  "error": "Detailed error (optional)"
}
```

---

## Public Endpoints

### Submit Contact Form

```
POST /contactus
```

**Auth:** None

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "+971501234567",
  "message": "I would like more information about your products."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | Yes | Contact's first name |
| `lastName` | string | Yes | Contact's last name |
| `email` | string | Yes | Valid email address |
| `phoneNumber` | string | No | Phone number |
| `message` | string | Yes | Inquiry message |

**Success Response:** `201 Created`

```json
{
  "message": "Thank you for contact us",
  "result": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+971501234567",
    "message": "I would like more information...",
    "status": "UNREAD",
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z"
  }
}
```

**Side effects:** Sends confirmation email to the user and notification email to the owner.

---

### Get Active Manuals (Public)

```
GET /manuals?type={type}
```

**Auth:** None

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Filter by type: `indoor`, `outdoor`, `airbunkers`, `vionvr`, or `All` |

**Success Response:** `200 OK`

```json
{
  "message": "Manual fetched",
  "success": true,
  "result": [
    {
      "_id": "...",
      "title": "Indoor Blaster Manual",
      "subCategory": "Blasters",
      "type": "indoor",
      "language": "ENG",
      "pdfURL": "pdf/1234567890_abc_manual.pdf",
      "isActive": true,
      "pdfId": { ... }
    }
  ]
}
```

Only manuals with `isActive: true` are returned.

---

## Admin Authentication

### Register Admin

```
POST /admin/auth/register
```

**Auth:** None

**Request Body:**

```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@gulflasertag.net",
  "password": "securepassword"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | Yes | |
| `lastName` | string | Yes | |
| `email` | string | Yes | Must not already be registered |
| `password` | string | Yes | Minimum 6 characters |

**Success Response:** `200 OK`

Sets `auth` cookie and `x-auth-token` header. Returns populated user object.

---

### Login

```
POST /admin/auth/login
```

**Auth:** None

**Request Body:**

```json
{
  "email": "admin@gulflasertag.net",
  "password": "securepassword"
}
```

**Success Response:** `200 OK`

```json
{
  "success": true,
  "message": "Login Successfully",
  "result": {
    "_id": "...",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@gulflasertag.net",
    "userType": "ADMIN"
  }
}
```

Sets `auth` and `admin_auth` cookies. Returns `x-auth-token` header.

**Error Responses:**
- `422` — Email not registered, incorrect password, or user is not admin

---

### Get Session

```
POST /admin/auth/session
```

**Auth:** Required

**Success Response:** `200 OK` — Returns populated user object.

**Error Responses:**
- `403` — Not authenticated or not admin
- `422` — Authenticated user not found

---

### Logout

```
POST /admin/auth/logout
```

**Auth:** Required

**Success Response:** `200 OK`

```json
{
  "message": "Logout"
}
```

Clears `auth` and `admin_auth` cookies.

---

## Admin — Manuals

All endpoints require admin authentication.

### Create Manual

```
POST /admin/manuals
```

**Request Body:**

```json
{
  "title": "Indoor Blaster Manual",
  "subCategory": "Blasters",
  "type": "indoor",
  "language": "ENG",
  "pdfURL": "pdf/1234567890_abc_manual.pdf",
  "pdfId": "507f1f77bcf86cd799439011",
  "isActive": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Manual title |
| `subCategory` | string | Yes | Sub-category name |
| `type` | string | Yes | `indoor`, `outdoor`, `airbunkers`, or `vionvr` |
| `language` | string | Yes | `ENG` or `ARA` |
| `pdfURL` | string | Yes | S3 key of the uploaded PDF |
| `pdfId` | string | Yes | MongoDB ObjectId of the PDF document |
| `isActive` | boolean | No | Default: `true` |

**Success Response:** `201 Created`

---

### List All Manuals

```
GET /admin/manuals
```

**Success Response:** `200 OK` — Returns all manuals (active and inactive).

---

### Get Single Manual

```
GET /admin/manuals/:id
```

**Success Response:** `200 OK`

**Error Responses:**
- `404` — Manual not found

---

### Update Manual

```
PATCH /admin/manuals/:id
```

**Request Body:** (all fields optional)

```json
{
  "title": "Updated Title",
  "subCategory": "Accessories",
  "type": "outdoor",
  "language": "ARA",
  "pdfURL": "pdf/new_file.pdf",
  "pdfId": "507f1f77bcf86cd799439012",
  "isActive": false
}
```

If `pdfId` is changed, the old PDF file is deleted from storage.

**Success Response:** `200 OK`

---

### Delete Manual

```
DELETE /admin/manuals/:id
```

Deletes the manual and its associated PDF from storage.

**Success Response:** `200 OK`

---

## Admin — PDF

### Upload PDF

```
POST /admin/pdf/upload
Content-Type: multipart/form-data
```

**Form field:** `file` (single PDF file)

**Constraints:**
- File must have `.pdf` extension
- Max ~4 MB after compression (up to 8 MB before compression)

**Success Response:** `200 OK`

```json
{
  "success": true,
  "result": {
    "_id": "...",
    "title": "manual.pdf",
    "pdfURL": "pdf/1234567890_abc_manual.pdf",
    "userId": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Delete PDF

```
POST /admin/pdf/delete
```

**Request Body:**

```json
{
  "key": "pdf/1234567890_abc_manual.pdf"
}
```

**Error:** Returns `400` if the PDF is linked to an existing manual.

**Success Response:** `200 OK`

```json
{
  "message": "File deleted successfully",
  "deleted": "pdf/1234567890_abc_manual.pdf"
}
```

---

### Get PDF Blob Info

```
POST /admin/pdf/blob
```

**Request Body:**

```json
{
  "key": "pdf/1234567890_abc_manual.pdf"
}
```

**Success Response:** `200 OK`

```json
{
  "name": "manual.pdf",
  "type": "application/pdf",
  "size": 1048576,
  "lastModifid": "..."
}
```

---

## Admin — Contact Us

### List Contacts

```
GET /admin/contactus
```

**Success Response:** `200 OK`

```json
{
  "message": "Contact Us Fetched",
  "result": [
    {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phoneNumber": 971501234567,
      "message": "...",
      "status": "UNREAD",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### Update Contact Status

```
PATCH /admin/contactus/:id
```

**Request Body:**

```json
{
  "status": "READ"
}
```

| Status | Description |
|--------|-------------|
| `UNREAD` | New submission (default) |
| `READ` | Viewed by admin |
| `REPLIED` | Admin has responded |

**Success Response:** `200 OK`

---

## Admin — Analytics

### Card Analytics

```
GET /admin/analytics/card
```

**Success Response:** `200 OK`

```json
{
  "message": "Card Analytics Fetched..",
  "success": true,
  "result": {
    "totalContactUS": 42,
    "totalActiveManuls": 18,
    "currentMonthManuals": 3,
    "difference": {
      "manuals": 1,
      "contactUs": -2
    }
  }
}
```

---

### List Analytics

```
GET /admin/analytics/list
```

**Success Response:** `200 OK`

```json
{
  "message": "List Analytics Fetched..",
  "success": true,
  "result": {
    "recentContactUs": [ ... ],
    "recentActiveManuls": [ ... ]
  }
}
```

Returns the 3 most recent contact submissions and 3 most recent active manuals.

---

## Authentication Header

For all protected endpoints, include the token using one of:

```
Authorization: <encrypted-token>
```

or rely on the signed `auth` / `admin_auth` cookie (with `credentials: true` in fetch/axios).

The token is also returned in the `x-auth-token` response header on login/register.

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `204` | No content (empty list) |
| `400` | Bad request |
| `403` | Unauthorized / forbidden |
| `404` | Not found |
| `422` | Validation error |
| `500` | Internal server error |
