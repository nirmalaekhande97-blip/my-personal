# API Layer

## Purpose

Handles all HTTP communication with the backend.

## Responsibilities

* Axios configuration
* Base URL setup
* API request functions
* Request/response interceptors

## Rules

* Do NOT call backend directly inside components.
* Keep API calls centralized here.
* Handle authentication headers here.

## Example Flow

Component → API → Backend → Response
