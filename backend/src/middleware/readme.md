# Middleware Layer

## Purpose

Handles request processing before reaching controllers.

Common middleware:

* Authentication / Authorization
* Logging
* Error handling
* Request validation
* Rate limiting

## Rules

* No business logic here.
* Should be reusable.
* Keep middleware small and focused.

## Flow

Request → Middleware → Controller → Response
