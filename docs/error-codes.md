# Alaqmar Services API - Error Codes

This document outlines the custom error codes returned by the Alaqmar Services API. These codes are returned in the JSON response body when an error occurs.

## Response Format
Error responses generally follow this structure:
```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Short error message",
  "description": "Detailed description of the error",
  "details": "Optional additional details (e.g., validation field names)"
}
```

## Error Codes

### Authorization Errors (AUTH)

| Code | Message | HTTP Status | Description |
| :--- | :--- | :--- | :--- |
| **AUTH_001** | Missing Verification Token | 400 | The request is missing required identification. You must provide either `clientId` query parameter or `x-api-key` header. |
| **AUTH_002** | Invalid Client | 401 | The provided `clientId` or `x-api-key` does not match any active client record. |
| **AUTH_003** | Access Denied: Unpaid Bills | 403 | The client account has outstanding bills (`billingStatus` is not `PAID`). Access is restricted. |
| **AUTH_004** | Maintenance Mode | 503 | The system is currently in maintenance mode. The response may include a `redirectUrl`. |

### Validation Errors (VAL)

| Code | Message | HTTP Status | Description |
| :--- | :--- | :--- | :--- |
| **VAL_001** | Invalid Request Format | 400 | The request parameters or body do not match the expected schema. |

### System Errors (SYS)

| Code | Message | HTTP Status | Description |
| :--- | :--- | :--- | :--- |
| **SYS_001** | Internal Server Error | 500 | An unexpected error occurred on the server side. Please contact support. |

## Success Codes

| Code | Message | HTTP Status | Description |
| :--- | :--- | :--- | :--- |
| **OK_001** | Authorized | 200 | The client is fully authorized and in good standing. |
