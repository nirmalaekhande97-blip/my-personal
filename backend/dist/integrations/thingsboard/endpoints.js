"use strict";
// integrations/thingsboard/endpoints.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TB_ENDPOINTS = void 0;
const thingsboard_1 = require("../../config/thingsboard");
// ---- Configuration ----
const TB_HOST = thingsboard_1.TB_CONFIG.host;
if (!TB_HOST) {
    throw new Error("Missing TB_HOST environment variable");
}
// ---- Endpoint Builders ----
exports.TB_ENDPOINTS = {
    getAttributesList: (entityType, entityId, scope) => `${TB_HOST}/api/plugins/telemetry/${entityType}/${entityId}/keys/attributes/${scope}`,
    postTelemetryAttributes: (entityType, entityId, scope) => `${TB_HOST}/api/plugins/telemetry/${entityType}/${entityId}/attributes/${scope}`,
    getTimeseriesKeys: (entityType, entityId) => `${TB_HOST}/api/plugins/telemetry/${entityType}/${entityId}/keys/timeseries`,
};
//# sourceMappingURL=endpoints.js.map