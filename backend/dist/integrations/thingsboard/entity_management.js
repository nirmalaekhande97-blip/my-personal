"use strict";
// integrations/thingsboard/entity_management.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttributeList = getAttributeList;
exports.postTelemetryAttributes = postTelemetryAttributes;
exports.getTimeseriesKeys = getTimeseriesKeys;
const client_1 = require("./client");
const endpoints_1 = require("./endpoints");
/**
 * Entity Management Integration for ThingsBoard
 *
 * This module provides functions to manage entity attributes and telemetry
 * in ThingsBoard using the authenticated client.
 */
/**
 * Fetch the list of attributes for an entity
 *
 * @param entityType - The type of entity (e.g., 'DEVICE', 'ASSET', 'CUSTOMER')
 * @param entityId - The unique identifier of the entity
 * @param scope - The scope of attributes (e.g., 'SERVER_SCOPE', 'CLIENT_SCOPE', 'SHARED_SCOPE')
 * @returns Promise containing the list of attributes organized by scope
 * @throws Error if the fetch request fails
 */
async function getAttributeList(entityType, entityId, scope) {
    try {
        const endpoint = endpoints_1.TB_ENDPOINTS.getAttributesList(entityType, entityId, scope);
        const response = await client_1.tbClient.get(endpoint);
        return response.data;
    }
    catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error('Error fetching attributes list:', {
            entityType,
            entityId,
            scope,
            error: errorMessage,
        });
        throw new Error(`Failed to fetch attributes: ${errorMessage}`);
    }
}
/**
 * Post telemetry attributes for an entity
 *
 * @param entityType - The type of entity (e.g., 'DEVICE', 'ASSET')
 * @param entityId - The unique identifier of the entity
 * @param scope - The scope of attributes to update
 * @param attributes - The attributes to post/update
 * @returns Promise containing the response from ThingsBoard
 * @throws Error if the post request fails
 */
async function postTelemetryAttributes(entityType, entityId, scope, attributes) {
    try {
        const endpoint = endpoints_1.TB_ENDPOINTS.postTelemetryAttributes(entityType, entityId, scope);
        await client_1.tbClient.post(endpoint, attributes);
    }
    catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error('Error posting telemetry attributes:', {
            entityType,
            entityId,
            scope,
            attributes,
            error: errorMessage,
        });
        throw new Error(`Failed to post telemetry attributes: ${errorMessage}`);
    }
}
/**
 * Get timeseries keys for an entity
 *
 * @param entityType - The type of entity (e.g., 'DEVICE', 'ASSET')
 * @param entityId - The unique identifier of the entity
 * @returns Promise containing the list of timeseries keys
 * @throws Error if the request fails
 */
async function getTimeseriesKeys(entityType, entityId) {
    try {
        const endpoint = endpoints_1.TB_ENDPOINTS.getTimeseriesKeys(entityType, entityId);
        const response = await client_1.tbClient.get(endpoint);
        return response.data;
    }
    catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
        console.error('Error fetching timeseries keys:', {
            entityType,
            entityId,
            error: errorMessage,
        });
        throw new Error(`Failed to fetch timeseries keys: ${errorMessage}`);
    }
}
/**
 * Legacy exports for backward compatibility
 */
exports.default = {
    getAttributeList,
    postTelemetryAttributes,
    getTimeseriesKeys,
};
//# sourceMappingURL=entity_management.js.map