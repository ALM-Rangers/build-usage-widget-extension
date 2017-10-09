import * as BuildWidget from "./buildWidget";
import * as tc from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
        WidgetHelpers.IncludeWidgetStyles();

        VSS.register("Widget", () => {
            return new BuildWidget.BuildWidget(WidgetHelpers);
        });

        tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("VSTS.BuildLoadTestUsage.Widget");
        VSS.notifyLoadSucceeded();
});
