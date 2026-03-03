/**
 * Attribute data interfaces
 */
interface Attribute {
    [key: string]: string | number | boolean | null;
}
interface AttributeListResponse {
    [scope: string]: Attribute[];
}
interface TelemetryAttributesPayload {
    [key: string]: string | number | boolean | object;
}
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
export declare function getAttributeList(entityType: string, entityId: string, scope: string): Promise<AttributeListResponse>;
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
export declare function postTelemetryAttributes(entityType: string, entityId: string, scope: string, attributes: TelemetryAttributesPayload): Promise<void>;
/**
 * Get timeseries keys for an entity
 *
 * @param entityType - The type of entity (e.g., 'DEVICE', 'ASSET')
 * @param entityId - The unique identifier of the entity
 * @returns Promise containing the list of timeseries keys
 * @throws Error if the request fails
 */
export declare function getTimeseriesKeys(entityType: string, entityId: string): Promise<string[]>;
/**
 * Legacy exports for backward compatibility
 */
declare const _default: {
    getAttributeList: typeof getAttributeList;
    postTelemetryAttributes: typeof postTelemetryAttributes;
    getTimeseriesKeys: typeof getTimeseriesKeys;
};
export default _default;
export type { Attribute, AttributeListResponse, TelemetryAttributesPayload, };
//# sourceMappingURL=entity_management.d.ts.map