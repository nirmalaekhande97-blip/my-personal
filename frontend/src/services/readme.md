# Services Layer

## Purpose

Contains frontend business logic.

Examples:

* Data transformation
* Formatting telemetry
* Calculations
* Filtering logic

## Rules

* No UI here.
* No direct DOM manipulation.
* Keep logic separate from components.

## Flow

Component → Service → Processed Data
