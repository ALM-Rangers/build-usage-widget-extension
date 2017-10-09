import * as BuildUsageHub from "./components/BuildUsageHub";
import * as Controls from "VSS/Controls";
import * as TFS_Core_Client from "TFS/Core/RestClient";
import * as Splitter from "VSS/Controls/Splitter";
import * as TreeView from "VSS/Controls/TreeView";
import * as tc from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");

export class BuildCollectionAdminHub {

    private treeview: TreeView.TreeView;
    private splitter: Splitter.Splitter;

    constructor() {
        this.splitter = <Splitter.Splitter>Controls.Enhancement.enhance(Splitter.Splitter, $(".buildhub-splitter"));
        this.splitter.resize(300);
        this.createTreeViewSection();
    }

    private createTreeViewSection() {
        let teamProjects = TFS_Core_Client.getClient().getProjects();

        teamProjects.then((projects) => {

            let nodes = new Array<TreeView.TreeNode>();
            let allTeamProjectsNode = new TreeView.TreeNode("All Team Projects");

            nodes.push(allTeamProjectsNode);

            projects.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

            for (let i = 0; i < projects.length; i++) {
                let node = new TreeView.TreeNode(projects[i].name, null, null, projects[i].id);
                nodes.push(node);
            }

            let treeviewOptions = {
                nodes: nodes,
                useBowtieStyle: true,
                height: "100%"
            };

            let container = $("#grid-container-teamprojects");
            container.bind("selectionchanged", (e) => {
                let selectedProject = this.treeview.getSelectedNode();
                BuildUsageHub.render(selectedProject.id, selectedProject.text, "build-usage-container");
            });

            this.treeview = Controls.create(TreeView.TreeView, container, treeviewOptions);
            this.treeview.setSelectedNode(allTeamProjectsNode);
        });
    }
}

let groupHub = new BuildCollectionAdminHub();
tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("VSTS.BuildLoadTestUsage.BuildCollectionAdminHub");

VSS.notifyLoadSucceeded();
