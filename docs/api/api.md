# API Reference

## Authentication

All API requests require an authentication token in the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN
```

## Endpoints

### GET /api/devices

Retrieve a list of all devices.

**Response:**
```json
{
    "devices": [
        {
            "id": "device-001",
            "name": "Sensor A",
            "status": "online"
        }
    ]
}
```

### POST /api/devices

Create a new device.

**Request Body:**
```json
{
    "name": "New Device",
    "type": "sensor"
}
```

### GET /api/devices/{deviceId}

Retrieve details for a specific device.

**Parameters:**
- `deviceId` (string, required): The device identifier

**Response:**
```json
{
    "id": "device-001",
    "name": "Sensor A",
    "status": "online",
    "lastUpdated": "2024-01-15T10:30:00Z"
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes and a message:

```json
{
    "error": "Device not found",
    "code": 404
}
```
