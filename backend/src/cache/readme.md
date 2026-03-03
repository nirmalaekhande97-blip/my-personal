# Cache Layer

## Purpose

Handles temporary data storage to improve performance and reduce repeated API/database calls.

Typical uses:

* Redis caching
* API response caching
* Session caching
* Frequently accessed telemetry/device data

## Rules

* Do NOT put business logic here.
* Only cache retrieval/storage logic.
* Services should call cache when needed.

## Example Flow

Service → Cache → External API/DB (fallback if cache miss)
