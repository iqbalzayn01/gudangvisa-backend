# Gudang Visa Backend

A REST API for tracking VISA, KITAS, and PASSPORT documents. Staff and admins manage immigration documents, while clients can publicly track their application status using a tracking code.

## Tech Stack

| Technology           | Purpose                         |
| -------------------- | ------------------------------- |
| **Node.js**          | Runtime                         |
| **TypeScript**       | Language (strict mode)          |
| **Express 5**        | Web framework                   |
| **Drizzle ORM**      | Database queries and migrations |
| **PostgreSQL**       | Database (via Supabase)         |
| **Supabase Storage** | File storage with signed URLs   |
| **JWT (jose)**       | Authentication                  |
| **bcrypt**           | Password hashing                |

---

## Project Structure

```
src/
├── app.ts                    # Express app setup and middleware
├── server.ts                 # Server entry point
├── config/
│   ├── env.ts                # Environment variables
│   └── supabase.ts           # Supabase client
├── db/
│   ├── index.ts              # Database connection
│   └── schema.ts             # Table definitions
├── middlewares/
│   ├── auth.middleware.ts     # JWT verification
│   ├── role.middleware.ts     # Role-based access control
│   └── error.middleware.ts    # Global error handler
├── modules/
│   ├── auth/                  # Login
│   ├── documents/             # Document CRUD + file upload
│   ├── tracking/              # Public document tracking
│   └── users/                 # User management (admin)
├── scripts/
│   └── seed.ts               # Database seeder
├── types/
│   ├── index.ts              # Shared TypeScript types
│   └── express/index.d.ts    # Express Request augmentation
└── utils/
    ├── AppError.ts           # Custom error class
    └── storage.ts            # Supabase Storage helpers
```

---

## Installation

### 1. Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A [Supabase](https://supabase.com/) account (for database and storage)

### 2. Clone the repository

```bash
git clone https://github.com/iqbalzayn01/gudangvisa-backend.git
cd gudangvisa-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up environment variables

Create a `.env` file in the project root:

```env
PORT=8000
DATABASE_URL="your-supabase-database-url"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-supabase-key"
```

**Where to find these values:**

| Variable       | Where to find it                                                                        |
| -------------- | --------------------------------------------------------------------------------------- |
| `DATABASE_URL` | Supabase Dashboard → Project Settings → Database → Connection string (Transaction mode) |
| `JWT_SECRET`   | Any random string. Generate one with: `openssl rand -hex 32`                            |
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL                               |
| `SUPABASE_KEY` | Supabase Dashboard → Project Settings → API → `anon` or `service_role` key              |

### 5. Set up the database

Generate and apply the database tables:

```bash
npm run db:generate
npm run db:migrate
```

### 6. Set up Supabase Storage

Go to your Supabase Dashboard → **Storage** and create a bucket with these settings:

| Setting            | Value                                        |
| ------------------ | -------------------------------------------- |
| Bucket name        | `gudangvisa-bucket`                          |
| Public             | `No` (private)                               |
| Allowed MIME types | `image/jpeg`, `image/png`, `application/pdf` |
| File size limit    | `2097152` (2 MB)                             |

### 7. Seed the admin account

```bash
npm run seed
```

This creates the first admin account:

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@gudangvisa.com` |
| Password | `admin123`             |

> **Important:** Change the admin password after your first login in production.

### 8. Start the server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

The server will start at `http://localhost:8000`.

---

## Available Scripts

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `npm run dev`         | Start dev server with hot reload  |
| `npm run build`       | Compile TypeScript to JavaScript  |
| `npm start`           | Run the compiled production build |
| `npm run seed`        | Create the initial admin account  |
| `npm run db:generate` | Generate database migration files |
| `npm run db:migrate`  | Apply migrations to the database  |

---

## Database Schema

The database has 3 tables:

### Users

| Column       | Type         | Description           |
| ------------ | ------------ | --------------------- |
| `id`         | UUID         | Primary key           |
| `name`       | VARCHAR(255) | Full name             |
| `email`      | VARCHAR(255) | Email (unique)        |
| `password`   | TEXT         | Hashed password       |
| `role`       | ENUM         | `STAFF` or `ADMIN`    |
| `created_at` | TIMESTAMP    | Account creation date |

### Documents

| Column          | Type         | Description                                   |
| --------------- | ------------ | --------------------------------------------- |
| `id`            | UUID         | Primary key                                   |
| `tracking_code` | VARCHAR(50)  | Unique tracking code (e.g., `GVI-1712345678`) |
| `client_name`   | VARCHAR(255) | Name of the document owner                    |
| `doc_type`      | ENUM         | `VISA`, `KITAS`, or `PASSPORT`                |
| `status`        | ENUM         | Current status (see below)                    |
| `file_url`      | TEXT         | Storage path of the uploaded file             |
| `created_by`    | UUID         | Staff member who created it                   |
| `created_at`    | TIMESTAMP    | Creation date                                 |
| `updated_at`    | TIMESTAMP    | Last update date                              |

### Tracking Histories

| Column        | Type      | Description                      |
| ------------- | --------- | -------------------------------- |
| `id`          | UUID      | Primary key                      |
| `document_id` | UUID      | Reference to the document        |
| `status`      | ENUM      | Status at that point in time     |
| `notes`       | TEXT      | Notes about the status change    |
| `changed_by`  | UUID      | Staff member who made the change |
| `created_at`  | TIMESTAMP | When the change was made         |

### Document Status Flow

```
RECEIVED → IN_REVIEW → IN_PROCESS → APPROVED → COMPLETED
                                   → REJECTED
```

---

## Authentication

This API uses **JWT (JSON Web Token)** for authentication.

### How to authenticate

1. Call `POST /api/v1/auth/login` with your email and password.
2. You will receive a `token` in the response.
3. Include this token in all protected requests:

```
Authorization: Bearer your-token-here
```

The token expires after **8 hours**.

### Roles

| Role      | Permissions                                                     |
| --------- | --------------------------------------------------------------- |
| **ADMIN** | Full access. Can manage users, documents, and delete documents. |
| **STAFF** | Can create documents, upload files, and update document status. |

---

## API Reference

**Base URL:** `http://localhost:8000`

All responses follow this format:

```json
{
  "success": true,
  "message": "Description of what happened",
  "data": {}
}
```

---

### Auth

#### `POST /api/v1/auth/login`

Login and get a JWT token.

**Request body:**

```json
{
  "email": "admin@gudangvisa.com",
  "password": "admin123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "name": "Super Admin",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**

| Status | Message             |
| ------ | ------------------- |
| 401    | Invalid credentials |

---

### Users (Admin Only)

> All user management routes require an **ADMIN** token.

#### `GET /api/v1/users/me`

Get the current logged-in user's profile. Accessible by both ADMIN and STAFF.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "success": true,
  "message": "User profile retrieved successfully!",
  "data": {
    "id": "uuid",
    "name": "Super Admin",
    "email": "admin@gudangvisa.com",
    "role": "ADMIN"
  }
}
```

---

#### `POST /api/v1/users`

Create a new staff member.

**Headers:** `Authorization: Bearer <admin-token>`

**Request body:**

```json
{
  "name": "Staff Budi",
  "email": "budi@gudangvisa.com",
  "password": "staff123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "New staff member added successfully!",
  "data": {
    "id": "uuid",
    "name": "Staff Budi",
    "email": "budi@gudangvisa.com",
    "role": "STAFF",
    "createdAt": "2026-04-19T..."
  }
}
```

**Errors:**

| Status | Message                                                |
| ------ | ------------------------------------------------------ |
| 400    | Email is already registered. Please use another email. |

---

#### `GET /api/v1/users`

Get a list of all users.

**Headers:** `Authorization: Bearer <admin-token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Staff list retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Super Admin",
      "email": "admin@gudangvisa.com",
      "role": "ADMIN",
      "createdAt": "..."
    }
  ]
}
```

---

#### `DELETE /api/v1/users/:id`

Delete a user by their ID.

**Headers:** `Authorization: Bearer <admin-token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Staff member deleted successfully"
}
```

**Errors:**

| Status | Message                            |
| ------ | ---------------------------------- |
| 404    | User not found or already deleted. |

---

### Documents

#### How File Uploads Work

This API uses **Signed URLs** for file uploads. The file never passes through the API server — it goes directly from the client to Supabase Storage. This is faster, more secure, and more efficient.

**The 3-step upload flow:**

```
Step 1: Client → API         : Request a signed upload URL
Step 2: Client → Supabase    : Upload the file directly using the signed URL
Step 3: Client → API         : Create the document record with the storage path
```

**File restrictions:**

- Maximum size: **2 MB**
- Allowed types: **JPG**, **PNG**, **PDF**

---

#### `POST /api/v1/documents/upload-url`

**Step 1:** Get a signed upload URL.

**Headers:** `Authorization: Bearer <token>`

**Request body:**

```json
{
  "fileName": "passport_scan.pdf",
  "contentType": "application/pdf",
  "fileSize": 1048576
}
```

| Field         | Type   | Required | Description                                                 |
| ------------- | ------ | -------- | ----------------------------------------------------------- |
| `fileName`    | string | Yes      | Name of the file                                            |
| `contentType` | string | Yes      | MIME type (`image/jpeg`, `image/png`, or `application/pdf`) |
| `fileSize`    | number | No       | File size in bytes (validated against 2 MB limit)           |

**Response (200):**

```json
{
  "success": true,
  "message": "Signed upload URL generated successfully.",
  "data": {
    "signedUrl": "https://...supabase.co/storage/v1/object/upload/sign/...",
    "storagePath": "documents/uuid/passport_scan.pdf",
    "token": "eyJ..."
  }
}
```

**Errors:**

| Status | Message                                                |
| ------ | ------------------------------------------------------ |
| 400    | Invalid file type. Only JPG, PNG, and PDF are allowed. |
| 400    | File size exceeds the maximum limit of 2 MB.           |

---

#### Step 2: Upload the file

Use the `signedUrl` from Step 1 to upload the file with a `PUT` request directly to Supabase:

```bash
curl -X PUT "SIGNED_URL_HERE" \
  -H "Content-Type: application/pdf" \
  --data-binary @/path/to/your/file.pdf
```

Or in JavaScript:

```javascript
const response = await fetch(signedUrl, {
  method: 'PUT',
  headers: { 'Content-Type': file.type },
  body: file,
});
```

---

#### `POST /api/v1/documents`

**Step 3:** Create the document record.

**Headers:** `Authorization: Bearer <token>`

**Request body:**

```json
{
  "clientName": "John Doe",
  "docType": "VISA",
  "storagePath": "documents/uuid/passport_scan.pdf"
}
```

| Field         | Type   | Required | Description                                            |
| ------------- | ------ | -------- | ------------------------------------------------------ |
| `clientName`  | string | Yes      | Name of the document owner                             |
| `docType`     | string | Yes      | `VISA`, `KITAS`, or `PASSPORT`                         |
| `storagePath` | string | No       | The path returned from Step 1. Leave empty if no file. |

**Response (201):**

```json
{
  "success": true,
  "message": "Document created successfully!",
  "data": {
    "id": "document-uuid",
    "trackingCode": "GVI-1712345678",
    "clientName": "John Doe",
    "docType": "VISA",
    "status": "RECEIVED",
    "fileUrl": "documents/uuid/passport_scan.pdf",
    "createdBy": "staff-uuid",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

> **Tip:** Save the `trackingCode` — this is the receipt number that clients use to track their document.

---

#### `GET /api/v1/documents/track/:trackingCode`

Track a document by its tracking code. **No authentication required** — this is for clients.

**Example:** `GET /api/v1/documents/track/GVI-1712345678`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "document-uuid",
    "trackingCode": "GVI-1712345678",
    "clientName": "John Doe",
    "docType": "VISA",
    "status": "IN_REVIEW",
    "fileUrl": "documents/uuid/passport_scan.pdf",
    "fileDownloadUrl": "https://...signed-temporary-url...",
    "histories": [
      {
        "id": "history-uuid",
        "status": "IN_REVIEW",
        "notes": "Document is being reviewed by staff.",
        "createdAt": "...",
        "user": { "name": "Staff Budi" }
      },
      {
        "id": "history-uuid",
        "status": "RECEIVED",
        "notes": "Document received and registered into the system.",
        "createdAt": "...",
        "user": { "name": "Super Admin" }
      }
    ]
  }
}
```

> **Note:** The `fileDownloadUrl` is a temporary signed URL that expires after 1 hour.

**Errors:**

| Status | Message                                              |
| ------ | ---------------------------------------------------- |
| 404    | Document not found. Please check your tracking code. |

---

#### `PATCH /api/v1/documents/:id/status`

Update a document's status. Each update creates a new entry in the tracking history.

**Headers:** `Authorization: Bearer <token>`

**Request body:**

```json
{
  "status": "IN_REVIEW",
  "notes": "Document is being reviewed by staff."
}
```

| Field    | Type   | Required | Description                        |
| -------- | ------ | -------- | ---------------------------------- |
| `status` | string | Yes      | New status (see status flow above) |
| `notes`  | string | Yes      | Notes about this status change     |

**Valid status values:** `RECEIVED`, `IN_REVIEW`, `IN_PROCESS`, `APPROVED`, `REJECTED`, `COMPLETED`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "document-uuid",
    "trackingCode": "GVI-1712345678",
    "status": "IN_REVIEW",
    "updatedAt": "..."
  }
}
```

---

#### `DELETE /api/v1/documents/:id`

Delete a document, all its tracking history, and its file from storage. **Admin only.**

**Headers:** `Authorization: Bearer <admin-token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Document deleted successfully."
}
```

**Errors:**

| Status | Message                                |
| ------ | -------------------------------------- |
| 404    | Document not found or already deleted. |

---

### Tracking

An alternative way for clients to track documents and for staff to update status.

#### `GET /api/v1/tracking/:code`

Track a document by its code. **No authentication required.**

**Example:** `GET /api/v1/tracking/GVI-1712345678`

**Response (200):**

```json
{
  "success": true,
  "message": "Document found",
  "data": {
    "id": "document-uuid",
    "trackingCode": "GVI-1712345678",
    "clientName": "John Doe",
    "docType": "VISA",
    "status": "IN_PROCESS",
    "fileDownloadUrl": "https://...signed-temporary-url...",
    "histories": [
      {
        "status": "IN_PROCESS",
        "notes": "Document is being processed.",
        "createdAt": "...",
        "user": { "name": "Staff Budi", "role": "STAFF" }
      }
    ]
  }
}
```

---

#### `PATCH /api/v1/tracking/:id/status`

Update a document's status via the tracking module.

**Headers:** `Authorization: Bearer <token>`

**Request body:**

```json
{
  "status": "IN_PROCESS",
  "notes": "Document is being processed."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {
    "id": "document-uuid",
    "status": "IN_PROCESS",
    "updatedAt": "..."
  }
}
```

---

## All Endpoints Summary

| #   | Method   | Endpoint                        | Auth | Role          | Description            |
| --- | -------- | ------------------------------- | ---- | ------------- | ---------------------- |
| 1   | `POST`   | `/api/v1/auth/login`            | No   | —             | Login                  |
| 2   | `GET`    | `/api/v1/users/me`              | Yes  | ADMIN, STAFF  | Get my profile         |
| 3   | `POST`   | `/api/v1/users`                 | Yes  | ADMIN         | Create staff           |
| 4   | `GET`    | `/api/v1/users`                 | Yes  | ADMIN         | List all users         |
| 5   | `DELETE` | `/api/v1/users/:id`             | Yes  | ADMIN         | Delete a user          |
| 6   | `POST`   | `/api/v1/documents/upload-url`  | Yes  | STAFF, ADMIN  | Get signed upload URL  |
| 7   | `POST`   | `/api/v1/documents`             | Yes  | STAFF, ADMIN  | Create a document      |
| 8   | `GET`    | `/api/v1/documents/track/:code` | No   | —             | Track a document       |
| 9   | `PATCH`  | `/api/v1/documents/:id/status`  | Yes  | STAFF, ADMIN  | Update document status |
| 10  | `DELETE` | `/api/v1/documents/:id`         | Yes  | ADMIN         | Delete a document      |
| 11  | `GET`    | `/api/v1/tracking/:code`        | No   | —             | Track a document       |
| 12  | `PATCH`  | `/api/v1/tracking/:id/status`   | Yes  | Authenticated | Update document status |

---

## Error Handling

All errors follow the same format:

```json
{
  "success": false,
  "message": "Description of what went wrong"
}
```

| Status Code | Meaning                                                      |
| ----------- | ------------------------------------------------------------ |
| 400         | Bad request (invalid input, wrong file type, file too large) |
| 401         | Not authenticated (missing or invalid token)                 |
| 403         | Forbidden (you don't have permission)                        |
| 404         | Not found                                                    |
| 500         | Server error                                                 |

---

## License

ISC
