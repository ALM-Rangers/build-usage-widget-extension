import * as Build from "./build";

export class BuildWidget {

    constructor(public WidgetHelpers) { }

    private showBuildUsage() {

        let today: Date = new Date();
        let minFinishTime: Date = new Date(today.getFullYear(), today.getMonth(), 1);
        let maxFinishTime: Date = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        let projectId: string = VSS.getWebContext().project.id;

        let buildHubUrl = `${VSS.getWebContext().host.uri}${VSS.getWebContext().project.name}/_apps/hub/${VSS.getExtensionContext().publisherId}.${VSS.getExtensionContext().extensionId}.BuildHub`;

        new Build.Build().getBuildMinutes(projectId, minFinishTime, maxFinishTime,
            (result: number) => {
                let htmlWidget = $("#buildWidget");
                let htmlWidgetInfo = $("#info");
                htmlWidget.text(Math.round(result));
                htmlWidgetInfo.text("minutes this month");
                $("#linkBuildHub").attr("href", buildHubUrl);
                $(".widget").show();
            },
            (error) => {
                let htmlWidget = $("#linkBuildHub");
                htmlWidget.text(error.message);
                $(".widget").show();
            }
        );

        return this.WidgetHelpers.WidgetStatusHelper.Success();
    }

    public load(widgetSettings) {
        return this.showBuildUsage();
    }

    public reload(widgetSettings) {
        return this.showBuildUsage();
    }
}
