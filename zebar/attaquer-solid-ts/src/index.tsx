/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { createStore } from "solid-js/store";
import * as zebar from "zebar";
import Workspaces from "./Workspaces/Workspace";

const providers = zebar.createProviderGroup({
  glazewm: { type: "glazewm" },
  cpu: { type: "cpu", refreshInterval: 3000 },
  memory: { type: "memory", refreshInterval: 5000 },
  weather: { type: "weather" },
  network: { type: "network", refreshInterval: 2000 },
  battery: { type: "battery", refreshInterval: 10000 },
  date: { type: "date", formatting: "HH:mm ccc d LLLL y" },
  media: { type: "media" },
  audio: { type: "audio" },
  systray: { type: "systray" },
});

render(() => <App />, document.getElementById("root")!);

function App() {
  const [output, setOutput] = createStore(providers.outputMap);
  providers.onOutput((outputMap) => setOutput(outputMap));
  return (
    <div class="app">
      <div class="left">
        <Workspaces glazewm={output.glazewm} />
      </div>
      <div class="center">
      </div>
      <div class="right">
      </div>
    </div>
  );
}
