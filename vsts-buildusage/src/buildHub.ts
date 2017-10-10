import * as BuildUsageHub from "./components/BuildUsageHub";
import * as tc from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");

BuildUsageHub.render(VSS.getWebContext().project.id, VSS.getWebContext().project.name, "hub-container");
tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("VSTS.BuildLoadTestUsage.BuildHub");

VSS.notifyLoadSucceeded();