import "./style.css";
import { Component } from "solid-js";
import { GlazeWmOutput } from "zebar";
import { For } from "solid-js";

interface CurrentAppsProps {
  glazewm: GlazeWmOutput;
}

const CurrentApps: Component<CurrentAppsProps> = (props) => {


  return (
		<div class="template">
			<For each={props.glazewm?.displayedWorkspace.children}>{(child) => {
        if (child.type == "window"){
          const handleAppClick = () => {
            props.glazewm.runCommand(
              `shell-exec %userprofile%/.glzr/zebar/attaquer-solid-ts/dist/assets/scripts/FocusWindow.ahk ${child.handle}`
            );
          };
          return <div class="window-title" onClick={handleAppClick}>{child.title}</div>;
        }
      }}</For>
		</div>
	);
};

export default CurrentApps;
