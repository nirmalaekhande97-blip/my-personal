export interface ThingsBoardConfig {
    host: string;
    auth: {
        username?: string;
        password?: string;
        staticToken?: string;
    };
    timeouts: {
        auth: number;
        request: number;
    };
    token: {
        refreshThresholdMinutes: number;
    };
}
export declare const TB_CONFIG: ThingsBoardConfig;
//# sourceMappingURL=thingsboard.d.ts.map