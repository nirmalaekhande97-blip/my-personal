# IoT Dashboard Backend (React → Node.js → ThingsBoard)

## 📌 Project Overview

This project connects a **React frontend dashboard** with a **Node.js backend** that integrates with **ThingsBoard IoT platform** to fetch device telemetry, manage devices, and serve processed data to the frontend.

The backend acts as a **secure middle layer** between frontend and ThingsBoard.

---

# 🏗️ Overall Architecture Flow

```
React Frontend
      ↓
HTTP API Request
      ↓
index.js (Server Entry)
      ↓
app.js (Express Setup)
      ↓
Routes Layer
      ↓
Controllers Layer
      ↓
Services Layer
      ↓
Cache / Integrations
      ↓
ThingsBoard API
      ↓
Response back to React
```

---

# 🔄 End-to-End Request Flow Example

## 1️⃣ React Frontend Request

Example:

```js
fetch("/api/devices")
```

Frontend requests device or telemetry data.

---

## 2️⃣ index.js (Server Entry Point)

Responsible for:

* Starting Express server
* Loading workers/background jobs
* Bootstrapping configuration

Example responsibility:

```
Start server
Load app.js
Connect DB/cache
Start background workers
```

This file should contain minimal logic.

---

## 3️⃣ app.js (Application Setup)

Main Express app configuration:

* Middleware setup
* Route mounting
* Error handling
* Body parsing
* Security middleware

Example flow:

```
Express App Initialization
→ Middleware
→ Routes Registration
→ Error Handler
```

---

## 4️⃣ Routes Layer

Defines API endpoints only.

Example:

```
GET /api/devices
POST /api/login
GET /api/telemetry/:deviceId
```

Responsibilities:

* Map URL → Controller
* No business logic

---

## 5️⃣ Controllers Layer

Controllers handle HTTP logic.

Responsibilities:

* Receive request (req)
* Validate input
* Call service functions
* Send response

Example:

```
Route calls controller
Controller validates request
Controller calls service
Controller sends response
```

Controllers should NOT:

* Query database directly
* Call ThingsBoard directly
* Implement heavy logic

---

## 6️⃣ Services Layer (Core Logic)

This is the brain of the backend.

Responsibilities:

* Business logic
* API integrations
* Data transformation
* Database interaction
* Cache coordination

Example:

```
Fetch device telemetry
Process raw data
Apply business rules
Return formatted result
```

This keeps controllers clean.

---

## 7️⃣ Cache Layer (Optional but Recommended)

Used to:

* Reduce repeated API calls
* Improve performance
* Store frequently accessed telemetry

Typical flow:

```
Service checks cache
If found → return cached data
Else → fetch from ThingsBoard
Store in cache
Return response
```

---

## 8️⃣ Integrations Layer (ThingsBoard)

Handles external communication.

Responsibilities:

* Authentication with ThingsBoard
* Device telemetry fetching
* Device management
* API token handling

No HTTP request handling here.

Only backend services should call this layer.

---

## 9️⃣ Workers Layer (Background Jobs)

Used for:

* Polling telemetry periodically
* Syncing device data
* Scheduled tasks
* Queue processing

Runs independently of frontend requests.

---

# 📂 Recommended Folder Structure

```
src/
│
├── config/           → App configuration
├── cache/            → Redis or caching layer
├── integrations/
│     └── thingsboard/ → ThingsBoard API logic
├── middleware/       → Express middleware
├── routes/           → API routes
├── controllers/      → Request handlers
├── services/         → Business logic
├── models/           → DB schemas (if used)
├── utils/            → Helper functions
├── workers/          → Background jobs
│
├── app.js            → Express setup
└── index.js          → Server entry point
```

---

# 🔐 Why Backend Middle Layer Is Important

### Security

* Hides ThingsBoard credentials
* Prevents direct frontend access

### Control

* Apply business rules
* Validate requests
* Manage caching

### Performance

* Reduce repeated API calls
* Aggregate data

---

# 🚀 Typical Development Flow

## Adding New Feature

1. Create route
2. Add controller
3. Add service logic
4. Add ThingsBoard integration if needed
5. Add caching if needed
6. Test API
7. Connect frontend

---

# 📊 Example Data Flow (Telemetry)

```
React Dashboard
      ↓
GET /api/telemetry/device123
      ↓
Route
      ↓
Controller
      ↓
Service
      ↓
Cache Check
      ↓
ThingsBoard API
      ↓
Format Data
      ↓
Return Response
```

---

# 🧠 Best Practices

### Controllers

* Thin
* No heavy logic

### Services

* Reusable
* Testable

### Config

* Use .env always

### Workers

* Handle retries/logging

### Integrations

* Isolate external APIs

---

# ⚠️ Common Beginner Mistakes

* Putting everything in controllers
* Direct frontend → ThingsBoard calls
* Hardcoding credentials
* Ignoring caching
* No error handling

Avoid these early.

---

# 📌 Future Improvements

* JWT authentication
* Role-based access
* WebSocket live telemetry
* Queue workers
* Docker deployment
* Monitoring/logging tools

---

# ✅ Summary

This architecture ensures:

* Clean separation of concerns
* Secure IoT integration
* Scalable backend structure
* Maintainable codebase

Frontend stays simple.
Backend handles complexity.
ThingsBoard remains isolated.

----------------------------------------------------

# Full Frontend + Backend Connection Example

**React (Vite + TypeScript) → Node.js Express Backend → ThingsBoard**

This guide shows how your frontend React app connects to your backend API, which then communicates with ThingsBoard.

---

# 🏗️ Overall Architecture

```
React Frontend (Vite + TS)
        ↓
Axios API Request (/api)
        ↓
Node Express Backend
        ↓
Service Layer
        ↓
ThingsBoard REST API
        ↓
Telemetry/Data Response
        ↓
Backend Response → React UI
```

Frontend NEVER calls ThingsBoard directly.
Backend acts as a secure middle layer.

---

# 📦 Backend Example

## 1️⃣ index.js (Server Entry)

```js
const app = require("./app");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Starts the server only.

---

## 2️⃣ app.js (Express Setup)

```js
const express = require("express");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();

app.use(express.json());
app.use("/api/devices", deviceRoutes);

module.exports = app;
```

Registers middleware and routes.

---

## 3️⃣ Route Layer

### routes/deviceRoutes.js

```js
const router = require("express").Router();
const controller = require("../controllers/deviceController");

router.get("/", controller.getDevices);

module.exports = router;
```

Routes map endpoint → controller.

---

## 4️⃣ Controller Layer

### controllers/deviceController.js

```js
const deviceService = require("../services/deviceService");

exports.getDevices = async (req, res) => {
  try {
    const devices = await deviceService.fetchDevices();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

Controller:

* Receives request
* Calls service
* Sends response

No heavy logic here.

---

## 5️⃣ Service Layer (ThingsBoard Integration)

### services/deviceService.js

Example integration:

```js
const axios = require("axios");

exports.fetchDevices = async () => {
  const response = await axios.get(
    "https://thingsboard.example/api/devices",
    {
      headers: {
        Authorization: "Bearer YOUR_TOKEN"
      }
    }
  );

  return response.data;
};
```

Responsibilities:

* Business logic
* API calls
* Data processing

---

# 🌐 Frontend Example (React + Vite + TS)

## 1️⃣ Axios API Client

### src/api/client.ts

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "/api"
});
```

This uses Vite proxy to reach backend.

---

## 2️⃣ Vite Proxy Setup

### vite.config.ts

```ts
export default {
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
};
```

Prevents CORS issues.

---

## 3️⃣ React Page Example

### src/pages/DevicesPage.tsx

```tsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

interface Device {
  id: string;
  name: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    api.get("/devices").then(res => {
      setDevices(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Devices</h2>
      {devices.map(d => (
        <div key={d.id}>{d.name}</div>
      ))}
    </div>
  );
}
```

Flow:

* Page loads
* API request triggered
* Backend responds
* UI updates

---

# 🔐 Authentication Flow (Optional Later)

Typical pattern:

```
React Login Form
        ↓
POST /api/login
        ↓
Backend validates user
        ↓
Returns JWT token
        ↓
Frontend stores token
        ↓
Token sent in future API calls
```

---

# ⚡ Data Flow Example (Telemetry)

```
React Dashboard
        ↓
GET /api/telemetry/device123
        ↓
Backend Controller
        ↓
Service checks cache (optional)
        ↓
ThingsBoard API request
        ↓
Backend formats data
        ↓
Frontend renders charts
```

---

# 🧠 Best Practices

## Backend

* Keep controllers thin
* Store credentials in .env
* Add caching for telemetry
* Separate integrations layer

## Frontend

* Centralize API calls
* Use TypeScript interfaces
* Avoid direct API calls inside UI everywhere
* Use proxy for development

---

# 🚨 Common Mistakes

❌ Calling ThingsBoard directly from React
❌ Hardcoding API URLs
❌ Mixing UI + business logic
❌ No error handling
❌ No TypeScript types

Avoid these early.

---

# 📂 Recommended Combined Structure

## Backend

```
src/
 ├── config/
 ├── cache/
 ├── integrations/thingsboard/
 ├── middleware/
 ├── routes/
 ├── controllers/
 ├── services/
 ├── workers/
 ├── utils/
 ├── app.js
 └── index.js
```

## Frontend

```
src/
 ├── api/
 ├── components/
 ├── pages/
 ├── hooks/
 ├── services/
 ├── utils/
 ├── types/
 ├── App.tsx
 └── main.tsx
```

---

# ✅ Final Summary

### Frontend Role

* UI rendering
* API requests
* State management

### Backend Role

* Security layer
* Business logic
* ThingsBoard communication

### ThingsBoard Role

* IoT device telemetry
* Device management
* Data storage

This separation keeps your system:

* Secure
* Scalable
* Maintainable
* Production-ready
