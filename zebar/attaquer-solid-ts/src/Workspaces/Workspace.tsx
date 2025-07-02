import "./style.css";
import { Component } from "solid-js";
import { GlazeWmOutput } from "zebar";

interface WorkspaceProps {
  workspace: GlazeWmOutput["currentWorkspaces"][number];
  glazewm: GlazeWmOutput;
}
const Workspace: Component<WorkspaceProps> = (props) => {
  var workspace = props.workspace
  return (
		<button
			classList={{
				workspace: true,
				focused: workspace.hasFocus,
				displayed: workspace.isDisplayed,
			}}
			onClick={() => props.glazewm.runCommand(`focus --workspace ${workspace.name}`)}
			id={workspace.name}
		>
			{workspace.displayName ?? workspace.name}
		</button>
	);
};

interface WorkspacesProps {
  glazewm: GlazeWmOutput; 
}
const Workspaces: Component<WorkspacesProps> = (props) => {
  return (
    <div class="workspaces">
      {props.glazewm?.currentWorkspaces.map((workspace) => (
        <Workspace workspace={workspace} glazewm={props.glazewm} />
      ))}
    </div>
  );
};

export default Workspaces;
