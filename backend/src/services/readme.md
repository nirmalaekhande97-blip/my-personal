# Services Layer

Purpose:
- Contains business logic.
- Handles database queries.
- Calls external APIs (ThingsBoard).
- Processes data.

Rules:
- Must NOT use req or res.
- Must return data to controller.
- Should be reusable.

Flow:
Controller → Service → Model / Integration