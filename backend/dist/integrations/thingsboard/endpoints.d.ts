export type EntityType = "DEVICE" | "ASSET" | "TENANT" | string;
export type AttributeScope = "CLIENT_SCOPE" | "SERVER_SCOPE" | "SHARED_SCOPE" | string;
export declare const TB_ENDPOINTS: {
    getAttributesList: (entityType: EntityType, entityId: string, scope: AttributeScope) => string;
    postTelemetryAttributes: (entityType: EntityType, entityId: string, scope: AttributeScope) => string;
    getTimeseriesKeys: (entityType: EntityType, entityId: string) => string;
};
//# sourceMappingURL=endpoints.d.ts.map