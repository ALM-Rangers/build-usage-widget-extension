import * as React from "react";

import { Pivot, PivotItem } from "office-ui-fabric-react/lib-amd/Pivot";
import { Label } from "office-ui-fabric-react/lib-amd/Label";

import {UsersGrid, BuildDefinitionsGrid, ControllersAgentsGrid, ProjectsGrid} from "./BuildUsageGrids";

import * as Build from "../build";

interface IHubContentProps extends React.Props<HubContent> {
    projectId: string;
    projectName: string;
    datasource: any;
    totalTime: number;
    errorMsg: string;
}

export class HubContent extends React.Component<IHubContentProps, any> {

    render() {
        let errorComponent = null;
        if (this.props.errorMsg !== null) {
            errorComponent = <Label className="error-msg" >An error occurred while retrieving build information: {this.props.errorMsg}</Label>;
        }

        let grids = null;
        if (this.props.projectId === "0") {
            grids = <ProjectsGrid datasource={this.props.datasource} projectName={this.props.projectName} />;
        }
        else {
            grids = <Pivot>
                        <PivotItem key="user" linkText="By Users">
                            <UsersGrid datasource={this.props.datasource} projectName={this.props.projectName} />
                        </PivotItem>
                        <PivotItem key="builddef" linkText="By Build Definitions">
                            <BuildDefinitionsGrid datasource={this.props.datasource} projectName={this.props.projectName} />
                        </PivotItem>
                        <PivotItem key="controller" linkText="By Build Controllers / Agent Pools">
                            <ControllersAgentsGrid datasource={this.props.datasource} projectName={this.props.projectName} />
                        </PivotItem>
                    </Pivot>;
        }

        return (
            <div className="content-region">
                <Label className="total-time" >Total Build Minutes: {Math.round(this.props.totalTime)}</Label>
                {errorComponent}
                <div className="grids">
                {grids}
                </div>
            </div>
        );
    }
}