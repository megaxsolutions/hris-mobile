# Employee Management App - Backend API Integration Guide

This document outlines the required API endpoints and data structures for the Employee Management App backend.

## Base URL
Configure the base URL in `.env`:
```env
EXPO_PUBLIC_API_URL=http://your-api.com/api
```

## Authentication Endpoints

### 1. User Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "department": "Engineering",
      "position": "Senior Developer",
      "phone": "+1234567890"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. Face Authentication
**Endpoint:** `POST /auth/face-authenticate`

**Request:**
```json
{
  "faceImage": "base64_encoded_face_image_data",
  "timestamp": "2026-01-30T10:30:00Z"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "department": "Engineering",
      "position": "Senior Developer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Face not recognized"
}
```

### 3. Register Face Data
**Endpoint:** `POST /auth/register-face`

**Request:**
```json
{
  "userId": "user_123",
  "faceImage": "base64_encoded_face_image_data",
  "timestamp": "2026-01-30T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Face data registered successfully"
  }
}
```

### 4. Refresh Token
**Endpoint:** `POST /auth/refresh-token`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 5. Logout
**Endpoint:** `POST /auth/logout`

**Request:**
```json
{
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## Location Endpoints

### 1. Save User Location
**Endpoint:** `POST /location/save`

**Request:**
```json
{
  "userId": "user_123",
  "latitude": 14.1234567,
  "longitude": 121.5678901,
  "accuracy": 5.0,
  "timestamp": "2026-01-30T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "location_456",
    "userId": "user_123",
    "latitude": 14.1234567,
    "longitude": 121.5678901,
    "accuracy": 5.0,
    "timestamp": "2026-01-30T10:30:00Z",
    "createdAt": "2026-01-30T10:30:00Z"
  }
}
```

---

## User Endpoints

### 1. Get User Profile
**Endpoint:** `GET /user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "department": "Engineering",
    "position": "Senior Developer",
    "phone": "+1234567890",
    "joinDate": "2020-01-15",
    "employeeId": "EMP001"
  }
}
```

### 2. Update User Profile
**Endpoint:** `PUT /user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "avatar": "base64_image_data"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully"
  }
}
```

---

## Attendance Endpoints

### 1. Get Attendance Records
**Endpoint:** `GET /attendance?startDate=2026-01-01&endDate=2026-01-31`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "att_001",
        "userId": "user_123",
        "date": "2026-01-30",
        "checkIn": "09:00:00",
        "checkOut": "17:30:00",
        "status": "present",
        "notes": "Regular day"
      }
    ]
  }
}
```

---

## DTR (Daily Time Record) Endpoints

### 1. Get DTR Records
**Endpoint:** `GET /dtr?month=01&year=2026`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "date": "2026-01-01",
        "day": "Wednesday",
        "timeIn": "09:00:00",
        "timeOut": "17:30:00",
        "totalHours": 8.5,
        "status": "present"
      }
    ],
    "summary": {
      "totalWorkingDays": 20,
      "presentDays": 20,
      "absentDays": 0,
      "totalHours": 170
    }
  }
}
```

---

## Leave Request Endpoints

### 1. Get Leave Requests
**Endpoint:** `GET /leave-requests?status=pending,approved,rejected`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "leave_001",
        "userId": "user_123",
        "startDate": "2026-02-01",
        "endDate": "2026-02-05",
        "type": "annual",
        "reason": "Vacation",
        "status": "pending",
        "createdAt": "2026-01-30T10:30:00Z",
        "updatedAt": "2026-01-30T10:30:00Z"
      }
    ]
  }
}
```

### 2. Submit Leave Request
**Endpoint:** `POST /leave-requests`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "startDate": "2026-02-01",
  "endDate": "2026-02-05",
  "type": "annual",
  "reason": "Vacation with family"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "leave_001",
    "status": "pending"
  }
}
```

---

## Overtime Request Endpoints

### 1. Get Overtime Requests
**Endpoint:** `GET /overtime-requests`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "ot_001",
        "userId": "user_123",
        "date": "2026-01-30",
        "hours": 3,
        "reason": "Project deadline",
        "status": "approved",
        "createdAt": "2026-01-30T10:30:00Z"
      }
    ]
  }
}
```

### 2. Submit Overtime Request
**Endpoint:** `POST /overtime-requests`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "date": "2026-01-30",
  "hours": 3,
  "reason": "Critical project work"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ot_001",
    "status": "pending"
  }
}
```

---

## Time Adjustment Request Endpoints

### 1. Get Time Adjustments
**Endpoint:** `GET /time-adjustments`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "ta_001",
        "userId": "user_123",
        "date": "2026-01-30",
        "adjustmentType": "in",
        "originalTime": "09:05:00",
        "adjustedTime": "09:00:00",
        "reason": "System error",
        "status": "approved",
        "createdAt": "2026-01-30T10:30:00Z"
      }
    ]
  }
}
```

### 2. Submit Time Adjustment Request
**Endpoint:** `POST /time-adjustments`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "date": "2026-01-30",
  "adjustmentType": "in",
  "originalTime": "09:05:00",
  "adjustedTime": "09:00:00",
  "reason": "System error during clock in"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ta_001",
    "status": "pending"
  }
}
```

---

## Payslip Endpoints

### 1. Get Payslips
**Endpoint:** `GET /payslips?year=2026&month=01`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payslips": [
      {
        "id": "payslip_001",
        "userId": "user_123",
        "period": "January 2026",
        "basicSalary": 50000,
        "allowances": {
          "housing": 5000,
          "transportation": 2000,
          "meal": 1000
        },
        "deductions": {
          "sss": 1125,
          "pagibig": 100,
          "philhealth": 350,
          "withholding": 5000
        },
        "netSalary": 51425,
        "generatedDate": "2026-01-30",
        "pdfUrl": "https://example.com/payslip_001.pdf"
      }
    ]
  }
}
```

---

## Error Responses

All endpoints follow a standard error response format:

```json
{
  "success": false,
  "error": "Error message",
  "errorCode": "ERROR_CODE"
}
```

### Common Error Codes:
- `INVALID_CREDENTIALS` - Email or password is incorrect
- `USER_NOT_FOUND` - User does not exist
- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - User doesn't have permission
- `VALIDATION_ERROR` - Invalid request data
- `SERVER_ERROR` - Internal server error
- `FACE_NOT_RECOGNIZED` - Face data not found or doesn't match

---

## Authentication Header

All authenticated endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user

## Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

## Pagination (for list endpoints)

Optional query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Example: `GET /attendance?page=1&limit=20`

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```
