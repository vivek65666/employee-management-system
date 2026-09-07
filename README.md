# Staffline - Employee Management System

A production-minded role-based employee management system built with React, Vite, Node.js, Express, MongoDB, Mongoose, JWT, and bcryptjs. It gives administrators a focused workspace for people, departments, and attendance while employees can access their own workspace and mark attendance.

## Features

- JWT authentication with bcrypt password hashing
- Admin and employee role-based authorization enforced by the API
- Employee CRUD with search, filters, pagination, and profile details
- Department CRUD with manager population
- Attendance marking, personal history, admin review, and duplicate-day protection
- Dashboard statistics from MongoDB aggregations
- Centralized Axios client and protected React routes
- Responsive desktop, tablet, and mobile interface
- Helmet, CORS, environment variables, consistent responses, and centralized errors

## Technology stack

React.js, Vite, JavaScript, React Router, Axios, CSS, Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Git, and Postman.

## Architecture

```text
backend/
  config/          MongoDB connection
  controllers/     HTTP request and business orchestration
  middleware/      authentication and authorization
  models/          Mongoose schemas and indexes
  routes/          REST endpoint definitions
  server.js        Express composition and error boundary
frontend/
  src/components/  reusable UI and route guards
  src/context/     authentication state
  src/pages/       application views
  src/services/    centralized Axios API client
```

## Installation

Prerequisites: Node.js 18+, a running MongoDB instance or MongoDB Atlas database, and npm.

```bash
npm install
npm run install:all
```

Create `backend/.env` from `backend/.env.example` and `frontend/.env` from `frontend/.env.example`.

### Backend

```bash
npm run dev --prefix backend
```

API: `http://localhost:5000`

### Frontend

```bash
npm run dev --prefix frontend
```

Web app: `http://localhost:5173`

Run both from the root with:

```bash
npm run dev
```

## Environment variables

Backend:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/employee_management
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files.

## API endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register an account |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Authenticated | Get current user |
| GET | `/api/employees` | Admin | Search and paginate employees |
| GET | `/api/employees/:id` | Authenticated | View an employee profile |
| POST | `/api/employees` | Admin | Create employee |
| PUT | `/api/employees/:id` | Admin | Update employee |
| DELETE | `/api/employees/:id` | Admin | Delete employee |
| GET | `/api/employees/dashboard` | Authenticated | Dashboard statistics |
| GET | `/api/departments` | Authenticated | List departments |
| GET | `/api/departments/:id` | Authenticated | View department |
| POST | `/api/departments` | Admin | Create department |
| PUT | `/api/departments/:id` | Admin | Update department |
| DELETE | `/api/departments/:id` | Admin | Delete department |
| GET | `/api/attendance` | Authenticated | Own records or all records for admin |
| GET | `/api/attendance/:id` | Authenticated | View one record |
| POST | `/api/attendance` | Authenticated | Mark attendance |
| PUT | `/api/attendance/:id` | Admin | Update attendance |

Authenticated requests use `Authorization: Bearer <JWT>`.

## Postman request examples

### Register

`POST http://localhost:5000/api/auth/register`

```json
{ "name": "Ada Admin", "email": "ada@example.com", "password": "password123", "role": "admin" }
```

### Login

`POST http://localhost:5000/api/auth/login`

```json
{ "email": "ada@example.com", "password": "password123" }
```

Copy `data.token` into a Postman Bearer Token authorization header for the protected requests above.

### Create department

`POST http://localhost:5000/api/departments` with Bearer token:

```json
{ "name": "Product", "description": "Builds the customer experience" }
```

### Create employee

`POST http://localhost:5000/api/employees` with Bearer token:

```json
{ "employeeId": "EMP-001", "name": "Morgan Lee", "email": "morgan@example.com", "phone": "+1 555 0100", "department": "DEPARTMENT_ID", "position": "Product Designer", "salary": 85000, "joiningDate": "2026-01-15", "password": "password123" }
```

### Mark attendance

`POST http://localhost:5000/api/attendance` with Bearer token:

```json
{ "employee": "EMPLOYEE_ID", "date": "2026-09-07", "status": "Present", "checkIn": "09:00" }
```

Employees omit `employee`; the API derives it from the authenticated user. Test authorization with an employee token against admin endpoints and expect `403`. Test duplicate attendance for the same employee/date and expect `409`. Invalid or missing tokens return `401`; invalid payloads return `400`; missing records return `404`.

## Screenshots

Add application screenshots here after running the frontend locally.

## GitHub usage

This project is ready to initialize as a repository. Use meaningful commits as work is completed, for example:

```text
feat: initialize employee management system
feat: implement jwt authentication
feat: implement employee crud APIs
feat: add department management
feat: implement attendance management
feat: build react dashboard
docs: add project documentation
```

No fake commit history is included.

## Future improvements

Refresh-token rotation, audit logs, CSV export, email invitations, richer attendance calendar views, automated tests, CI checks, and production deployment manifests.
