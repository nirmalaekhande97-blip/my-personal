# Configuration Layer

## Purpose

Central place for application configuration.

Includes:

* Environment variables (.env)
* API URLs
* Database configs
* Redis configs
* App constants

## Rules

* Never hardcode secrets in code.
* Use environment variables.
* Keep all configs centralized here.

## Example

PORT, DB_URL, THINGSBOARD_URL, REDIS_URL
