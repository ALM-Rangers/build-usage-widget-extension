import * as React from "react";
import * as ReactDOM from "react-dom";
import Q = require("q");

import * as TFS_Core_Client from "TFS/Core/RestClient";
import { IDropdownOption } from "office-ui-fabric-react/lib-amd/DropDown";
import { HubContent } from "./HubContent";
import { HubTitle } from "./HubTitle";

import * as Build from "../build";
import {DataSourceStorage} from "../DataSourceStorage";

interface IBuildUsageHubProps extends React.Props<BuildUsageHub> {
    projectId: string;
    projectName: string;
}

export class BuildUsageHub extends React.Component<IBuildUsageHubProps, any> {
    private build: Build.Build;
    private minFinishTime: Date = null;
    private maxFinishTime: Date = null;

    constructor(props) {
        super(props);
        this.build = new Build.Build();
        let today = new Date();
        this.minFinishTime = new Date(today.getFullYear(), today.getMonth(), 1),
        this.maxFinishTime = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59),

        this.state = {
            showDateRange: false,
            datasource: null,
            totalTime: null,
            errorMsg: null,
        };

        this.loadBuildMinutes = this.loadBuildMinutes.bind(this);
        this.onSelectStartDate = this.onSelectStartDate.bind(this);
        this.onSelectFinishDate = this.onSelectFinishDate.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onExportToCSV = this.onExportToCSV.bind(this);
        this.loadAllTeamProjectsBuildMinutes = this.loadAllTeamProjectsBuildMinutes.bind(this);
        this.refreshDataSource = this.refreshDataSource.bind(this);
    }

    render() {
        return (
            <div>
                <HubTitle
                    showDateRange={this.state.showDateRange}
                    onExportToCSV={this.onExportToCSV}
                    onSelectStartDate={this.onSelectStartDate}
                    onSelectFinishDate={this.onSelectFinishDate}
                    onFilterChange={this.onFilterChange}
                />
                <HubContent
                    projectId={this.props.projectId}
                    projectName={this.props.projectName}
                    datasource={this.state.datasource}
                    totalTime={this.state.totalTime}
                    errorMsg={this.state.errorMsg} />
            </div>
        );
    }

    private refreshDataSource(projectId: string) {
        this.setState({totalTime: 0, datasource: null, errorMsg: null});

        if (projectId === "0") {
            this.loadAllTeamProjectsBuildMinutes();
        }
        else {
            this.loadBuildMinutes(projectId);
        }
    }

    private loadBuildMinutes(projectId: string) {
        this.build.getBuildExecutions(projectId, this.minFinishTime, this.maxFinishTime,
            (result) => {
                let totalTime: number = result.totalTime;
                let buildDataSource: Array<Build.BuildDetails> = result.buildDataSource;

                this.setState({totalTime: totalTime, datasource: buildDataSource, errorMsg: null});
            },
            (error) => {
                this.setState({totalTime: 0, datasource: null, errorMsg: error});
            }
        );
    }

    private loadAllTeamProjectsBuildMinutes() {
        let teamProjects = TFS_Core_Client.getClient().getProjects();
        let promises = [];

        teamProjects.then((projects) => {
            let datasource = [];
            for (let i = 0; i < projects.length; i++) {
                let project = projects[i];
                let buildsPromise = this.build.getBuildExecutions2(project, datasource, this.minFinishTime, this.maxFinishTime);
                promises.push(buildsPromise);
            }

            Q.all(promises).then(() => {
                let totalMinutes = 0;
                datasource.forEach(p => totalMinutes += p.minutes);
                this.setState({totalTime: Math.round(totalMinutes), datasource: datasource, errorMsg: null});
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.refreshDataSource(nextProps.projectId);
    }
    componentDidMount() {
        this.refreshDataSource(this.props.projectId);
    }

    onExportToCSV() {
        let datasource = DataSourceStorage.getCurrentDataSource();
        let csvContent = "data:text/csv;charset=utf-8,";
        let header: string;

        if (datasource !== null) {
            for (let i = 0; i < datasource.length; i++) {
                if (!header) {
                    header = Object.keys(datasource[i]).join(",");
                    csvContent += header;
                }
                let dataArray = Object.keys(datasource[i]).map(function (j) { return datasource[i][j]; });
                csvContent += "\r\n" + dataArray.join(",");
            }

            let encodedUri = encodeURI(csvContent);
            window.open(encodedUri);
        }
        else {
            console.log("ExportToCSV: No datasource available to export.");
        }
    }

    onSelectStartDate(date: Date) {
        this.minFinishTime = date;
        this.refreshDataSource(this.props.projectId);
    }

    onSelectFinishDate(date: Date) {
        this.maxFinishTime = date;
        this.refreshDataSource(this.props.projectId);
    }

    onFilterChange(item: IDropdownOption) {
        let selectedRange = item.text;
        let today = new Date();
        let startDate = null;
        let finishDate = null;

        switch (selectedRange) {
            case "This month":
                this.minFinishTime = new Date(today.getFullYear(), today.getMonth(), 1);
                this.maxFinishTime = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
                break;
            case "Last month":
                this.minFinishTime = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                this.maxFinishTime = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
                break;
            case "This year":
                this.minFinishTime = new Date(today.getFullYear(), 0, 1);
                this.maxFinishTime = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
                break;
            case "Custom":
                this.setState({ showDateRange: true });
                break;
        }
        // update the data range
        if (selectedRange !== "Custom") {
            this.refreshDataSource(this.props.projectId);
            this.setState({
                showDateRange: false,
            });
        }
    }
}

export function render(projectId: string, projectName: string, containerId: string): void {
    ReactDOM.render(<BuildUsageHub projectId={projectId} projectName={projectName} />, document.getElementById(containerId));
}