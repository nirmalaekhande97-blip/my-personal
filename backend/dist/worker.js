"use strict";
// src/worker.ts
// Background Worker Service
//
// This worker handles background jobs independently of the main API server.
// It shares the same ThingsBoard auth and Redis connections.
// To add jobs, register handlers below using the job queue.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables before any other imports
dotenv_1.default.config();
console.log('[Worker] Starting background worker service...');
// ----------------------------------------------------------------
// Redis / Bull queue will be wired here in future steps.
// For now the worker validates env, confirms connectivity, and
// keeps the process alive so Docker considers the container stable.
// ----------------------------------------------------------------
const WORKER_POLL_INTERVAL_MS = 30000; // 30 seconds
/**
 * Placeholder: perform a health-check tick.
 * Replace this with real job processing once queues are added.
 */
async function tick() {
    console.log(`[Worker] Tick at ${new Date().toISOString()}`);
}
/**
 * Main worker loop
 */
async function start() {
    try {
        console.log('[Worker] Worker service started successfully.');
        console.log(`[Worker] NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`[Worker] Polling every ${WORKER_POLL_INTERVAL_MS / 1000}s`);
        // Initial tick
        await tick();
        // Keep worker alive with periodic ticks
        setInterval(async () => {
            try {
                await tick();
            }
            catch (err) {
                console.error('[Worker] Tick error:', err);
            }
        }, WORKER_POLL_INTERVAL_MS);
    }
    catch (err) {
        console.error('[Worker] Fatal startup error:', err);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[Worker] Received SIGTERM — shutting down gracefully.');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('[Worker] Received SIGINT — shutting down gracefully.');
    process.exit(0);
});
start();
//# sourceMappingURL=worker.js.map