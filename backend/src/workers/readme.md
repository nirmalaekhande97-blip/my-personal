# Workers Layer

## Purpose

Background job processing independent of HTTP requests.

Typical uses:

* Scheduled jobs (cron)
* Queue processing
* IoT telemetry polling
* Batch processing
* Notifications or cleanup tasks

## Rules

* Should not handle HTTP requests.
* Should log failures clearly.
* Keep retry/error strategies in mind.

## Example Flow

Worker → Service → External API/DB
