// integrations/thingsboard/entity_management.ts

import { tbClient } from './client';
import { TB_ENDPOINTS } from './endpoints';

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
export async function getAttributeList(
  entityType: string,
  entityId: string,
  scope: string
): Promise<AttributeListResponse> {
  try {
    const endpoint = TB_ENDPOINTS.getAttributesList(entityType, entityId, scope);
    const response = await tbClient.get(endpoint);
    return response.data;
  } catch (error: any) {
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
export async function postTelemetryAttributes(
  entityType: string,
  entityId: string,
  scope: string,
  attributes: TelemetryAttributesPayload
): Promise<void> {
  try {
    const endpoint = TB_ENDPOINTS.postTelemetryAttributes(entityType, entityId, scope);
    await tbClient.post(endpoint, attributes);
  } catch (error: any) {
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
export async function getTimeseriesKeys(
  entityType: string,
  entityId: string
): Promise<string[]> {
  try {
    const endpoint = TB_ENDPOINTS.getTimeseriesKeys(entityType, entityId);
    const response = await tbClient.get(endpoint);
    return response.data;
  } catch (error: any) {
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
export default {
  getAttributeList,
  postTelemetryAttributes,
  getTimeseriesKeys,
};

// Export types
export type {
  Attribute,
  AttributeListResponse,
  TelemetryAttributesPayload,
};