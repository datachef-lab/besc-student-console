# Admission Courses API Documentation

This document describes the API endpoints for managing admission course mappings in the BESC Student Console.

## Base URL
```
/api/admissions/courses-map
```

## Overview
The Admission Courses API allows you to manage the mapping between admissions and courses. This enables administrators to specify which courses are available for each admission cycle.

## Data Model

### AdmissionCourse
```typescript
{
  id: number;                    // Primary key
  admissionId: number;           // Reference to admission
  courseId: number;              // Reference to course
  disabled: boolean;             // Soft delete flag
  createdAt: string;             // Creation timestamp
  updatedAt: string;             // Last update timestamp
  remarks: string | null;        // Optional remarks
}
```

## Endpoints

### 1. Create Admission Course
**POST** `/api/admissions/courses-map`

Creates a new admission course mapping.

#### Request Body
```json
{
  "admissionId": 1,
  "courseId": 5,
  "remarks": "Optional remarks"
}
```

#### Response
- **201 Created**: Course mapping created successfully
```json
{
  "course": {
    "id": 1,
    "admissionId": 1,
    "courseId": 5,
    "disabled": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "remarks": "Optional remarks"
  },
  "message": "New Admission Course Created!"
}
```

- **409 Conflict**: Course mapping already exists
```json
{
  "message": "Admission course already exists.",
  "course": { /* existing course data */ }
}
```

### 2. Get Admission Courses
**GET** `/api/admissions/courses-map`

Retrieves admission course mappings with various filtering options.

#### Query Parameters
- `id` (number): Get specific admission course by ID
- `admissionId` (number): Get all courses for a specific admission
- `courseId` (number): Get all admissions for a specific course
- `active` (boolean): Filter by active status (true = not disabled)
- `withDetails` (boolean): Include related course and admission details

#### Examples

**Get all admission courses:**
```
GET /api/admissions/courses-map
```

**Get admission course by ID:**
```
GET /api/admissions/courses-map?id=1
```

**Get admission course by ID with details:**
```
GET /api/admissions/courses-map?id=1&withDetails=true
```

**Get all courses for admission:**
```
GET /api/admissions/courses-map?admissionId=1
```

**Get all courses for admission with details:**
```
GET /api/admissions/courses-map?admissionId=1&withDetails=true
```

**Get all active courses:**
```
GET /api/admissions/courses-map?active=true
```

**Get all active courses with details:**
```
GET /api/admissions/courses-map?active=true&withDetails=true
```

#### Response with Details
When `withDetails=true`, the response includes related data:

```json
{
  "id": 1,
  "admissionId": 1,
  "courseId": 5,
  "disabled": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "remarks": "Optional remarks",
  "course": {
    "id": 5,
    "name": "Computer Science",
    "shortName": "CS",
    "codePrefix": "CS",
    "universityCode": "CS001",
    "disabled": false,
    "amount": 50000
  },
  "admission": {
    "id": 1,
    "year": 2024,
    "isClosed": false,
    "startDate": "2024-01-01",
    "lastDate": "2024-12-31",
    "isArchived": false
  }
}
```

### 3. Update Admission Course
**PUT** `/api/admissions/courses-map?id={id}`

Updates an existing admission course mapping.

#### Request Body
```json
{
  "admissionId": 1,
  "courseId": 5,
  "remarks": "Updated remarks"
}
```

#### Response
- **200 OK**: Course updated successfully
```json
{
  "id": 1,
  "admissionId": 1,
  "courseId": 5,
  "disabled": false,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z",
  "remarks": "Updated remarks"
}
```

### 4. Disable/Enable Admission Course
**PUT** `/api/admissions/courses-map?id={id}&action={action}`

Soft delete/restore an admission course mapping.

#### Actions
- `action=disable`: Soft delete (set disabled=true)
- `action=enable`: Restore (set disabled=false)

#### Examples
```
PUT /api/admissions/courses-map?id=1&action=disable
PUT /api/admissions/courses-map?id=1&action=enable
```

#### Response
- **200 OK**: Action completed successfully
```json
{
  "id": 1,
  "admissionId": 1,
  "courseId": 5,
  "disabled": true,  // or false for enable
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z",
  "remarks": "Optional remarks"
}
```

### 5. Delete Admission Course
**DELETE** `/api/admissions/courses-map?id={id}`

Permanently deletes an admission course mapping.

#### Response
- **200 OK**: Course deleted successfully
```json
{
  "message": "Admission course deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Admission course ID is required"
}
```

### 404 Not Found
```json
{
  "message": "Admission course not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Usage Examples

### Frontend Integration

```typescript
// Create a new admission course mapping
const createMapping = async (admissionId: number, courseId: number) => {
  const response = await fetch('/api/admissions/courses-map', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ admissionId, courseId })
  });
  return response.json();
};

// Get all courses for an admission with details
const getAdmissionCourses = async (admissionId: number) => {
  const response = await fetch(
    `/api/admissions/courses-map?admissionId=${admissionId}&withDetails=true`
  );
  return response.json();
};

// Disable a course mapping
const disableCourse = async (id: number) => {
  const response = await fetch(
    `/api/admissions/courses-map?id=${id}&action=disable`,
    { method: 'PUT' }
  );
  return response.json();
};
```

### cURL Examples

```bash
# Create admission course mapping
curl -X POST http://localhost:3000/api/admissions/courses-map \
  -H "Content-Type: application/json" \
  -d '{"admissionId": 1, "courseId": 5}'

# Get all courses for admission with details
curl "http://localhost:3000/api/admissions/courses-map?admissionId=1&withDetails=true"

# Disable a course mapping
curl -X PUT "http://localhost:3000/api/admissions/courses-map?id=1&action=disable"

# Delete a course mapping
curl -X DELETE "http://localhost:3000/api/admissions/courses-map?id=1"
```

## Notes

1. **Soft Delete**: Use the disable action instead of hard delete to maintain data integrity
2. **Duplicate Prevention**: The API prevents creating duplicate admission-course mappings
3. **Cascading**: Deleting an admission course mapping may affect related application forms
4. **Performance**: Use `withDetails=true` only when you need the related data, as it performs joins
5. **Validation**: Ensure admissionId and courseId exist before creating mappings 