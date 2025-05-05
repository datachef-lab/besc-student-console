# Document API Documentation

The Documents API provides access to student academic documents such as marksheets, degree certificates, and registration certificates.

## API Endpoints

### List Documents

Retrieves a list of all available documents for a student.

**URL:** `/api/docs`

**Method:** `GET`

**Query Parameters:**

| Parameter          | Type   | Required | Description                                                        |
| ------------------ | ------ | -------- | ------------------------------------------------------------------ |
| rollNumber         | string | Yes      | The roll number of the student                                     |
| stream             | string | Yes      | Academic stream (BCOM, BA, BSC, MCOM, MA, BBA)                     |
| registrationNumber | string | No       | The registration number of the student (optional)                  |
| token              | string | No       | JWT token for authentication (alternative to Authorization header) |

**Authentication:**

- Bearer token in `Authorization` header
- Access token cookie
- Token in query parameter

**Success Response:**

```json
{
  "message": "Found 5 document(s)",
  "documents": [
    {
      "filePath": "/path/to/document.pdf",
      "semester": 1,
      "type": "MARKSHEET",
      "fileName": "document.pdf"
    },
    {
      "filePath": "/path/to/certificate.pdf",
      "semester": null,
      "type": "DEGREE CERTIFICATES (2023)",
      "fileName": "certificate.pdf"
    }
  ]
}
```

**Error Response:**

```json
{
  "error": "Roll number and stream are required"
}
```

### Download Document

Downloads or previews a specific document.

**URL:** `/api/docs`

**Method:** `GET`

**Query Parameters:**

| Parameter   | Type   | Required | Description                                                                                   |
| ----------- | ------ | -------- | --------------------------------------------------------------------------------------------- |
| filePath    | string | Yes      | Full path to the document file                                                                |
| disposition | string | No       | How the file should be presented: `attachment` for download (default) or `inline` for preview |
| token       | string | No       | JWT token for authentication (alternative to Authorization header)                            |

**Authentication:**

- Bearer token in `Authorization` header
- Access token cookie
- Token in query parameter

**Success Response:**

- The file content is returned with appropriate `Content-Type` and `Content-Disposition` headers
- Common content types include PDF, Word documents, Excel files, etc.

**Error Response:**

```json
{
  "error": "File not found"
}
```

## Implementation Details

The Documents API is built on these core components:

1. **src/app/api/docs/route.ts** - API endpoint implementation
2. **src/lib/services/docs.ts** - Core document scanning and retrieval functionality
3. **src/components/documents/DocumentContent.tsx** - UI component for viewing documents

## Security Features

- JWT token authentication required for all operations (via header, cookie, or query parameter)
- Path sanitization to prevent directory traversal attacks
- Restricted file access to designated document directories only
- Content-Type validation and proper MIME type assignment

## Usage Example

```javascript
// List documents for a student
async function getStudentDocuments(rollNumber, stream, accessToken) {
  const response = await fetch(
    `/api/docs?rollNumber=${rollNumber}&stream=${stream}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return await response.json();
}

// Preview a document
function previewDocument(filePath, accessToken) {
  window.open(
    `/api/docs?filePath=${encodeURIComponent(
      filePath
    )}&disposition=inline&token=${encodeURIComponent(accessToken)}`,
    "_blank"
  );
}

// Download a document
function downloadDocument(filePath, accessToken) {
  window.open(
    `/api/docs?filePath=${encodeURIComponent(
      filePath
    )}&disposition=attachment&token=${encodeURIComponent(accessToken)}`,
    "_blank"
  );
}
```
