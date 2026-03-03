// integrations/thingsboard/endpoints.ts

import { TB_CONFIG } from '../../config/thingsboard';

// ---- Configuration ----
const TB_HOST = TB_CONFIG.host;

if (!TB_HOST) {
  throw new Error("Missing TB_HOST environment variable");
}

// ---- Strong Types (Optional but Recommended) ----
export type EntityType = "DEVICE" | "ASSET" | "TENANT" | string;

export type AttributeScope =
  | "CLIENT_SCOPE"
  | "SERVER_SCOPE"
  | "SHARED_SCOPE"
  | string;

// ---- Endpoint Builders ----
export const TB_ENDPOINTS = {
  getAttributesList: (
    entityType: EntityType,
    entityId: string,
    scope: AttributeScope
  ): string =>
    `${TB_HOST}/api/plugins/telemetry/${entityType}/${entityId}/keys/attributes/${scope}`,

  postTelemetryAttributes: (
    entityType: EntityType,
    entityId: string,
    scope: AttributeScope
  ): string =>
    `${TB_HOST}/api/plugins/telemetry/${entityType}/${entityId}/attributes/${scope}`,

  getTimeseriesKeys: (
    entityType: EntityType,
    entityId: string
  ): string =>
    `${TB_HOST}/api/plugins/telemetry/${entityType}/${entityId}/keys/timeseries`,
};