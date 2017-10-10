import * as tc from "telemetryclient-team-services-extension";

export const settings: tc.TelemetryClientSettings = {
    key: "__INSTRUMENTATIONKEY__",
    extensioncontext: "VSTS.BuildLoadTestUsage",
    disableTelemetry: "false",
    disableAjaxTracking: "true",
    enableDebug: "false"
};