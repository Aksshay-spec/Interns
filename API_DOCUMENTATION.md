# API Documentation

## Base URL
- Development: `http://localhost:5000` (or configured port)
- All endpoints return JSON responses

## Authentication
Include JWT token in request header:
```
Authorization: Bearer <token>
```

## Auth Endpoints

### POST /auth/signup
Register new user
**Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword",
  "name": "User Name",
  "role": "student|tutor|tenant|admin"
}
```
**Response**: `{ token, user }`

### POST /auth/login
Authenticate user
**Body**:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
**Response**: `{ token, user }`

### POST /auth/password-reset
Request password reset email
**Body**:
```json
{
  "email": "user@example.com"
}
```

## Admin Endpoints

### GET /admin/users
Get all users (admin only)
**Query params**: `?role=student&status=active&page=1&limit=10`
**Response**: `{ users: [], total, pages }`

### PATCH /admin/tenant/:tenantId
Approve/block/activate tenant
**Body**:
```json
{
  "status": "approved|blocked|inactive|active"
}
```

### GET /admin/dashboard
Get admin dashboard statistics
**Response**: `{ totalUsers, totalTenants, totalClasses, totalStudents, recentActivities }`

## Tenant Endpoints

### POST /tenant
Create new tenant/organization
**Body**:
```json
{
  "name": "Organization Name",
  "description": "Description",
  "location": "City, State",
  "phone": "1234567890"
}
```

### GET /tenant/:tenantId
Get tenant profile
**Response**: `{ tenant: {...} }`

### PATCH /tenant/:tenantId
Update tenant profile
**Body**: Any updatable tenant fields

### GET /tenant/:tenantId/tutors
Get all tutors in tenant
**Response**: `{ tutors: [] }`

### POST /tenant/:tenantId/tutor
Add tutor to tenant
**Body**:
```json
{
  "email": "tutor@example.com",
  "name": "Tutor Name"
}
```

## Tutor Endpoints

### GET /tutor
Get current tutor profile
**Response**: `{ tutor: {...} }`

### POST /tutor/class
Create new class
**Body**:
```json
{
  "title": "Class Title",
  "description": "Description",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "maxStudents": 30,
  "meetingLink": "https://zoom.com/..."
}
```

### GET /tutor/classes
Get all classes created by tutor
**Query params**: `?status=active&page=1`
**Response**: `{ classes: [], total }`

### PATCH /tutor/class/:classId
Update class details
**Body**: Any updatable class fields

### GET /tutor/class/:classId/students
Get students enrolled in class
**Response**: `{ students: [] }`

### POST /tutor/class/:classId/mark-attendance
Mark attendance for students
**Body**:
```json
{
  "attendanceRecords": [
    { "studentId": "...", "status": "present|absent" }
  ]
}
```

## Student Endpoints

### GET /student
Get current student profile
**Response**: `{ student: {...} }`

### GET /student/classes
Get all available classes
**Query params**: `?search=keyword&tenantId=...&page=1`
**Response**: `{ classes: [], total }`

### POST /student/enroll/:classId
Enroll in class
**Response**: `{ enrollment: {...} }`

### GET /student/my-classes
Get enrolled classes for current student
**Response**: `{ classes: [] }`

### GET /student/class/:classId
Get specific class details
**Response**: `{ class: {...}, materials: [], announcements: [] }`

### POST /student/class/:classId/leave
Unenroll from class
**Response**: `{ message: "Successfully left class" }`

## Class Endpoints

### GET /class/:classId
Get class details
**Response**: `{ class: {...}, instructor: {...}, studentCount: 0 }`

### GET /class/:classId/materials
Get class materials/resources
**Response**: `{ materials: [] }`

### POST /class/:classId/material
Add material to class (tutor only)
**Body**: Form-data with file
**Response**: `{ material: {...} }`

### GET /class/:classId/announcements
Get class announcements
**Response**: `{ announcements: [] }`

### POST /class/:classId/announcement
Post announcement (tutor only)
**Body**:
```json
{
  "content": "Announcement text",
  "priority": "normal|urgent"
}
```

## Error Responses

Common error codes:
- **400**: Bad request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not found
- **500**: Server error

Error response format:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Rate Limiting
API implements rate limiting to prevent abuse.
- Standard: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP

## Pagination
List endpoints support:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sort field with direction (`-fieldName` for desc)

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "current": 1,
    "total": 5,
    "limit": 10
  }
}
```
