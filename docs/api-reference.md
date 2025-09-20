---
layout: default
title: API Reference
---

# API Reference

Complete API documentation for Project AruXI.

## Overview

The Project AruXI API provides a comprehensive set of endpoints for managing and interacting with your data. All API requests use JSON format and require authentication.

## Authentication

All API requests require authentication using an API key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.project-aruxi.com/v1/endpoint
```

## Base URL

```
https://api.project-aruxi.com/v1/
```

## Core Endpoints

### Users

#### Get User Information

```http
GET /users/{user_id}
```

**Parameters:**
- `user_id` (required): The unique identifier for the user

**Response:**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Create User

```http
POST /users
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### Update User

```http
PUT /users/{user_id}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Delete User

```http
DELETE /users/{user_id}
```

### Projects

#### List Projects

```http
GET /projects
```

**Query Parameters:**
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Number of results to skip (default: 0)
- `sort` (optional): Sort field (default: created_at)

**Response:**
```json
{
  "projects": [
    {
      "id": "proj_123",
      "name": "My Project",
      "description": "Project description",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

#### Get Project

```http
GET /projects/{project_id}
```

#### Create Project

```http
POST /projects
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "settings": {
    "public": false,
    "collaboration": true
  }
}
```

## Error Handling

The API uses conventional HTTP response codes:

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request is missing required parameters",
    "details": {
      "missing_fields": ["name", "email"]
    }
  }
}
```

## Rate Limiting

API requests are limited to 1000 requests per hour per API key. Rate limit information is included in response headers:

- `X-RateLimit-Limit`: Request limit per hour
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: UTC timestamp when the rate limit resets

## SDKs and Libraries

We provide official SDKs for popular programming languages:

- **JavaScript/Node.js**: `npm install aruxi-sdk`
- **Python**: `pip install aruxi-sdk`
- **Ruby**: `gem install aruxi-sdk`
- **Go**: `go get github.com/project-aruxi/go-sdk`

## Webhooks

Configure webhooks to receive real-time notifications about events:

```http
POST /webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["user.created", "project.updated"],
  "secret": "your_webhook_secret"
}
```

## Examples

See our [examples page](examples.html) for complete code samples and use cases.