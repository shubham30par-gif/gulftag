# Gulf Laser Tag — Backend API

Backend REST API for the **Gulf Laser Tag** platform. It powers the public website (contact form, product manuals) and the admin panel (authentication, PDF management, manuals, contact inbox, and analytics).

## Overview

| Item | Details |
|------|---------|
| **Project name** | `adminpanelbackend` |
| **Runtime** | Node.js + TypeScript |
| **Framework** | Express 5 |
| **Database** | MongoDB (`gulflasertag` database) |
| **File storage** | DigitalOcean Spaces (S3-compatible) |
| **Email** | Resend |
| **Default port** | `6000` (overridable via `PORT`) |

## Features

- **Admin authentication** — Register, login, session, and logout with AES-encrypted tokens and signed cookies
- **PDF management** — Upload, delete, and inspect PDFs stored on S3-compatible object storage
- **Product manuals** — CRUD for manuals linked to PDFs, categorized by type and language
- **Contact us** — Public form submission with automated email notifications (user + owner)
- **Analytics dashboard** — Summary cards and recent activity lists for admins
- **Public manuals API** — Fetch active manuals filtered by product type

## Tech Stack

- **Express** — HTTP server and routing
- **Mongoose** — MongoDB ODM
- **Joi** — Request validation
- **Multer** — File upload handling (in-memory)
- **AWS SDK v3** — S3/Spaces upload and delete
- **crypto-js** — Password and token encryption
- **Resend** — Transactional email
- **cookie-parser** — Signed cookie support

## Project Structure

```
gulflasertag/
├── src/
│   ├── server.ts              # Entry point — loads env, connects DB, starts server
│   ├── app.ts                 # Express app setup, middleware, route mounting
│   ├── dbConnection.ts        # MongoDB connection
│   ├── request.ts             # Extended Express Request types
│   ├── controller/
│   │   ├── admin/             # Protected admin routes
│   │   │   ├── auth/          # Login, register, session, logout
│   │   │   ├── manuals/       # Manual CRUD
│   │   │   ├── pdf/           # PDF upload, delete, blob info
│   │   │   ├── contactUs/     # View and update contact submissions
│   │   │   └── analytics/     # Dashboard analytics
│   │   ├── contactUs/         # Public contact form
│   │   └── manuals/           # Public manuals listing
│   ├── modules/               # Data layer (schemas, types, DB operations)
│   │   ├── user/
│   │   ├── manuals/
│   │   ├── pdf/
│   │   ├── contactUs/
│   │   ├── image/
│   │   └── blog/
│   ├── middlewares/
│   │   ├── validateAuthEmailToken.ts
│   │   ├── validateIsAdmin.ts
│   │   └── filesUpload.ts
│   └── helper/
│       └── sendEmail.ts
├── package.json
├── tsconfig.json
└── .env                       # Environment variables (not committed)
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or remote)
- DigitalOcean Spaces (or any S3-compatible storage)
- Resend account and API key

### Installation

```bash
# Clone and enter the project
cd gulflasertag

# Install dependencies
npm install

# Create environment file
cp .env.example .env   # or create .env manually — see Environment Variables below

# Start development server
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload (`ts-node-dev`) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled app from `dist/server.js` |
| `npm run watch` | Alternative dev command with env config |

### Production Build

Ensure `tsconfig.json` has `"outDir": "./dist"` set before building:

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env` file in the project root. **Never commit this file.**

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URI` | Yes | MongoDB connection string |
| `PORT` | No | Server port (default: `6000`) |
| `NODE_ENV` | No | Environment label (`dev`, `production`, etc.) |
| `COOKIE_SECRET` | Yes | Secret for signing cookies |
| `PASS_KEY` | Yes | AES key for encrypting/decrypting passwords |
| `AES_ADMIN_KEY` | Yes | AES key for encrypting/decrypting auth tokens |
| `BASE_URL` | Yes | Public base URL for uploaded files (Spaces CDN URL) |
| `S3_END_POINT` | Yes | S3-compatible endpoint (e.g. DigitalOcean Spaces) |
| `AWS_REGION` | Yes | Storage region |
| `AWS_ACCESS_KEY` | Yes | Storage access key |
| `AWS_SECRET_KEY` | Yes | Storage secret key |
| `AWS_BUCKET_NAME` | Yes | Bucket/space name |
| `RESEND_API_KEY` | Yes | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | No | Sender address (default: `Gulflasertag <contact@gulflasertag.net>`) |
| `OWNER_EMAIL` | No | Owner notification email for contact form submissions |

## API Routes

Base URL: `http://localhost:{PORT}`

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/contactus` | Submit a contact form |
| `GET` | `/manuals?type={type}` | List active manuals (filter by type or `All`) |

### Admin Routes

All admin routes are prefixed with `/admin`. Protected routes require authentication.

#### Authentication (`/admin/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/admin/auth/register` | No | Register a new admin user |
| `POST` | `/admin/auth/login` | No | Admin login |
| `POST` | `/admin/auth/session` | Yes | Get current session user |
| `POST` | `/admin/auth/logout` | Yes | Logout and clear cookies |

#### Manuals (`/admin/manuals`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/admin/manuals` | Yes | Create a manual |
| `GET` | `/admin/manuals` | Yes | List all manuals |
| `GET` | `/admin/manuals/:id` | Yes | Get a single manual |
| `PATCH` | `/admin/manuals/:id` | Yes | Update a manual |
| `DELETE` | `/admin/manuals/:id` | Yes | Delete a manual and its PDF |

#### PDF (`/admin/pdf`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/admin/pdf/upload` | Yes | Upload a PDF file (`multipart/form-data`, field: `file`) |
| `POST` | `/admin/pdf/delete` | Yes | Delete a PDF by key |
| `POST` | `/admin/pdf/blob` | Yes | Get PDF blob metadata |

#### Contact Us (`/admin/contactus`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/contactus` | Yes | List all contact submissions |
| `PATCH` | `/admin/contactus/:id` | Yes | Update contact status (`UNREAD`, `READ`, `REPLIED`) |

#### Analytics (`/admin/analytics`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/analytics/card` | Yes | Dashboard summary cards |
| `GET` | `/admin/analytics/list` | Yes | Recent contacts and manuals |

For detailed request/response examples, see [docs/API.md](./docs/API.md).

## Authentication

Admin routes use token-based authentication:

1. **Login/Register** returns an AES-encrypted token in:
   - Response header: `x-auth-token`
   - Signed cookie: `auth` (and `admin_auth` on login)

2. **Subsequent requests** must include the token via one of:
   - `Authorization` header
   - Signed cookie `auth` or `admin_auth`

3. **Middleware chain** for protected admin routes:
   - `validateAuthEmailToken` — decrypts token, loads user
   - `validateIsAdmin` — ensures `userType === "ADMIN"`

Passwords are AES-encrypted at rest using `PASS_KEY`.

## Data Models

### User (`users`)

| Field | Type | Notes |
|-------|------|-------|
| `firstName` | String | |
| `lastName` | String | |
| `email` | String | Unique login identifier |
| `password` | String | AES-encrypted |
| `userType` | String | `ADMIN` for admin users |
| `profileImage` | ObjectId | Reference to image |
| `blogIds` | ObjectId[] | Blog references |

### Manual (`manuals`)

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | |
| `subCategory` | String | |
| `type` | String | `indoor`, `outdoor`, `airbunkers`, `vionvr` |
| `language` | String | `ENG` or `ARA` |
| `pdfId` | ObjectId | Reference to PDF document |
| `pdfURL` | String | S3 key/URL |
| `isActive` | Boolean | Default: `true` |
| `arabianTitle` | String | Arabic title (optional) |
| `arabianSubCategory` | String | |
| `arabianType` | String | |

### PDF (`pdf`)

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Original filename |
| `pdfURL` | String | S3 object key |
| `userId` | ObjectId | Uploader reference |
| `arabianTitle` | String | |

### Contact Us (`contactus`)

| Field | Type | Notes |
|-------|------|-------|
| `firstName` | String | |
| `lastName` | String | |
| `email` | String | |
| `phoneNumber` | Number | |
| `message` | String | |
| `status` | String | `UNREAD`, `READ`, `REPLIED` (default: `UNREAD`) |

## Manual Types

Product manuals are organized by type:

| Type | Description |
|------|-------------|
| `indoor` | Indoor laser tag equipment |
| `outdoor` | Outdoor laser tag equipment |
| `airbunkers` | Air bunkers products |
| `vionvr` | Vion VR products |

## PDF Upload Constraints

- Only `.pdf` files are accepted
- Maximum size: **4 MB** after compression (up to 8 MB accepted before compression)
- Files are stored at `pdf/{timestamp}_{id}_{filename}` on object storage
- A PDF linked to an active manual cannot be deleted until the manual is removed

## CORS & Cookies

- CORS is enabled with `origin: true` and `credentials: true`
- The `x-auth-token` header is exposed to clients
- Request body limit: **50 MB**

## Related Projects

- **Admin panel frontend**: `https://admin.gulflasertag.net`
- **Public website**: Gulf Laser Tag marketing site (consumes `/manuals` and `/contactus`)

## License

ISC
