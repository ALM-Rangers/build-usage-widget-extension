import * as Tfs_Build_Client from "TFS/Build/RestClient";
import * as Tfs_Build_Contracts from "TFS/Build/Contracts";

export class Build {

    public getBuildMinutes(projectId: string, startDate: Date, finishDate: Date, successCallback, errorCallback): void {

        let builds = this.getBuilds(projectId, startDate, finishDate);
        let totalMiliSeconds: number = 0;

        builds.then(
            (buildContracts) => {
                for (let i = 0; i < buildContracts.length; i++) {
                    totalMiliSeconds += (buildContracts[i].finishTime.valueOf() - buildContracts[i].startTime.valueOf());
                }
                successCallback((totalMiliSeconds / 1000 / 60));
            },
            (error) => {
                errorCallback(error);
            }
        );
    }

    public getBuildExecutions(projectId: string, startDate: Date, finishDate: Date, successCallback, errorCallback): void {
        let builds = this.getBuilds(projectId, startDate, finishDate);

        builds.then(
            (builds) => {
                let totalTime: number = 0;
                let buildDataSource = new Array<BuildDetails>();

                for (let i = 0; i < builds.length; i++) {
                    let build: Tfs_Build_Contracts.Build = builds[i];
                    let buildDefinition: string = build.definition.name;
                    let buildController: string = (build.controller == null ? build.queue.pool.name : build.controller.name);
                    let minutes: number = (build.finishTime.valueOf() - build.startTime.valueOf()) / 1000 / 60;
                    totalTime += minutes;

                    buildDataSource.push(new BuildDetails(build.requestedFor.displayName, minutes, buildDefinition, buildController, build.definition.id));
                }
                successCallback({ totalTime: totalTime, buildDataSource: buildDataSource });
            },
            (error) => {
                errorCallback(error);
            }
        );
    }

    public getBuildExecutions2(project, datasource, minFinishTime, maxFinishTime): any {
        let buildsPromise = this.getBuilds(project.id, minFinishTime, maxFinishTime);

        buildsPromise.then((builds) => {
            let totalMinutes = 0;

            for (let j = 0; j < builds.length; j++) {
                let build = builds[j];
                let minutes: number = (build.finishTime.valueOf() - build.startTime.valueOf()) / 1000 / 60;
                totalMinutes += minutes;
            }

            datasource.push({
                teamproject: project.name,
                minutes: Math.round(totalMinutes)
            });
        });

        return buildsPromise;
    }

    private getBuilds(projectId: string, startDate: Date, finishDate: Date): IPromise<Tfs_Build_Contracts.Build[]> {
        let builds = Tfs_Build_Client.getClient().getBuilds(projectId, null, null, null, startDate, finishDate,
            null, null, null, null, null, null, null, null, null, Tfs_Build_Contracts.QueryDeletedOption.IncludeDeleted);

        return builds;
    }
}

export class BuildDetails {

    private _user: string;
    private _minutes: number;
    private _buildDefinition: string;
    private _buildController: string;
    private _buildDefinitionId: number;

    constructor(user: string, minutes: number, buildDefinition: string, buildController: string, buildDefinitionId: number) {
        this._user = user;
        this._minutes = minutes;
        this._buildDefinition = buildDefinition;
        this._buildController = buildController;
        this._buildDefinitionId = buildDefinitionId;
    }

    get User(): string {
        return this._user;
    }

    get Minutes(): number {
        return this._minutes;
    }

    get BuildDefinition(): string {
        return this._buildDefinition;
    }

    get BuildController(): string {
        return this._buildController;
    }

    get BuildDefinitionId(): number {
        return this._buildDefinitionId;
    }
}