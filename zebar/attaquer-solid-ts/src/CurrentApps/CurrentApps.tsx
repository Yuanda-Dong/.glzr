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
        if (child.type == "window") {
          const handleAppClick = () => {
            props.glazewm.runCommand(
              `shell-exec %userprofile%/.glzr/zebar/attaquer-solid-ts/dist/assets/scripts/FocusWindow.ahk ${child.handle}`
            );
          };
          const handleRightClick = () => {
            props.glazewm.runCommand(
              `set-minimized`
            );
          }
          return <div class="window-title" onClick={handleAppClick} onContextMenu={handleRightClick}>
            {child.title.length > 15 ? child.title.slice(0, 5) + '…' : child.title}
          </div>;
        }
      }}</For>
    </div>
  );
};

export default CurrentApps;
