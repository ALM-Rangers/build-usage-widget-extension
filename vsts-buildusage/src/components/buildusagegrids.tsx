import * as React from "react";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib-amd/Spinner";
import { DetailsList, IColumn } from "office-ui-fabric-react/lib-amd/DetailsList";
import { Link } from "office-ui-fabric-react/lib-amd/Link";

import {Grid} from "./Grid";
import {DataSourceStorage} from "../DataSourceStorage";
import * as Build from "../build";
import * as _ from "underscore";

interface IBuildUsageGrids {
    datasource: any;
    projectName: string;
}

export class UsersGrid extends React.Component<IBuildUsageGrids, any> {

    private readonly columns: IColumn[] = [
      {
        key: "user",
        name: "User",
        fieldName: "user",
        minWidth: 250,
        maxWidth: 400,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        data: "string"
      },
      {
        key: "minutes",
        name: "Minutes",
        fieldName: "minutes",
        minWidth: 60,
        maxWidth: 70,
        isResizable: true,
        data: "number"
      }
    ];

    private getUserDataSource(): Array<any> {

        return  _.chain(this.props.datasource)
                    .groupBy("User")
                    .map((builds, user) => {
                        let sum = _.reduce(builds, (acc, build: Build.BuildDetails) => { return acc + build.Minutes; }, 0);
                        return { user: user, minutes: Math.round(sum) };
                    })
                    .sortBy("user")
                    .value();
    }

    render() {
        let renderGrid = (<div><br /><Spinner size={ SpinnerSize.large } /></div>);
        if (this.props.datasource !== null) {
            let data = this.getUserDataSource();
            renderGrid = (<Grid sorteditems={data} columns={this.columns} />);
            DataSourceStorage.setCurrentDataSource(data);
        }
        return renderGrid;
    }
}

export class BuildDefinitionsGrid extends React.Component<IBuildUsageGrids, any> {

    private readonly columns: IColumn[] = [
      {
        key: "buildDefinition",
        name: "Build Definition",
        fieldName: "buildDefinition",
        minWidth: 250,
        maxWidth: 400,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        data: "string"
      },
      {
        key: "minutes",
        name: "Minutes",
        fieldName: "minutes",
        minWidth: 60,
        maxWidth: 70,
        isResizable: true,
        data: "number"
      }
    ];

    constructor(props) {
        super(props);
        this.renderItemColumn = this.renderItemColumn.bind(this);
    }

    private getBuildDefinitionDataSource(): Array<any> {

        return _.chain(this.props.datasource)
                .groupBy("BuildDefinition")
                .map((builds, buildDefinition) => {
                    let sum = _.reduce(builds, (acc, build: Build.BuildDetails) => { return acc + build.Minutes; }, 0);
                    return { buildDefinition: buildDefinition, minutes: Math.round(sum), buildDefinitionId: builds[0].BuildDefinitionId };
                })
                .sortBy("buildDefinition")
                .value();
    }

    public renderItemColumn(item: any, index: number, column: IColumn) {
        let fieldContent = item[column.fieldName];
        let url = `${VSS.getWebContext().host.uri}${this.props.projectName}/_build?definitionId=${item.buildDefinitionId}`;
        let itemColumn = fieldContent;
        if (column.key === "buildDefinition") {
            itemColumn = (<a href={url} target="_top">{ fieldContent }</a>);
        }
        return itemColumn;
    }

    render() {
        let renderGrid = (<div><br /><Spinner size={ SpinnerSize.large } /></div>);
        if (this.props.datasource !== null) {
            let data = this.getBuildDefinitionDataSource();
            renderGrid = (<Grid
                            sorteditems={data}
                            columns={this.columns}
            renderItemColumn={this.renderItemColumn} />);
            DataSourceStorage.setCurrentDataSource(data);
        }
        return renderGrid;
    }
}

export class ControllersAgentsGrid extends React.Component<IBuildUsageGrids, any> {

    private readonly columns: IColumn[] = [
      {
        key: "buildController",
        name: "Build Controller",
        fieldName: "buildController",
        minWidth: 250,
        maxWidth: 400,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        data: "string"
      },
      {
        key: "minutes",
        name: "Minutes",
        fieldName: "minutes",
        minWidth: 60,
        maxWidth: 70,
        isResizable: true,
        data: "number"
      }
    ];

    private getBuildControllerDataSource(): Array<any> {

        return _.chain(this.props.datasource)
                .groupBy("BuildController")
                .map((builds, buildController) => {
                    let sum = _.reduce(builds, (acc, build: Build.BuildDetails) => { return acc + build.Minutes; }, 0);
                    return { buildController: buildController, minutes: Math.round(sum) };
                })
                .sortBy("buildController")
                .value();
    }

    render() {
        let renderGrid = (<div><Spinner size={ SpinnerSize.large } /></div>);
        if (this.props.datasource !== null) {
            let data = this.getBuildControllerDataSource();
            renderGrid = (<Grid sorteditems={data} columns={this.columns} />);
            DataSourceStorage.setCurrentDataSource(data);
        }
        return renderGrid;
    }
}

export class ProjectsGrid extends React.Component<IBuildUsageGrids, any> {

    private readonly columns: IColumn[] = [
      {
        key: "teamproject",
        name: "Team Project",
        fieldName: "teamproject",
        minWidth: 250,
        maxWidth: 400,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        data: "string"
      },
      {
        key: "minutes",
        name: "Minutes",
        fieldName: "minutes",
        minWidth: 60,
        maxWidth: 70,
        isResizable: true,
        data: "number"
      }
    ];

    private getTeamProjectDataSource(): Array<any> {

        return _.chain(this.props.datasource)
                .sortBy("teamproject")
                .value();
    }

    render() {
        let renderGrid = (<div><Spinner size={ SpinnerSize.large } /></div>);
        if (this.props.datasource !== null) {
            let data = this.getTeamProjectDataSource();
            renderGrid = (<Grid sorteditems={data} columns={this.columns} />);
            DataSourceStorage.setCurrentDataSource(data);
        }
        return renderGrid;
    }
}