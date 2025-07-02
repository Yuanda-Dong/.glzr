import "./style.css";
import { Component, For, createSignal } from "solid-js";
import { SystrayOutput, GlazeWmOutput } from "zebar";

interface SystrayProps {
	systray: SystrayOutput;
	glazewm: GlazeWmOutput;
}

const Systray: Component<SystrayProps> = (props) => {
	const [expanded, setExpanded] = createSignal(true);

	const l = ["Bluetooth","GlazeWM", "Cisco", "Global", "Power", "Zebar"]

	return (
		<div class="systray-container">
			{props.systray?.icons && (
				<div class={`systray ${expanded() ? "visible" : ""}`}>
					<For each={props.systray.icons.filter(x => l.some(y => x.tooltip.includes(y)) )}>
						{(icon) => (
							<div
								class="systray-icon-container"
								title={icon.tooltip}
								onClick={() => props.systray.onLeftClick(icon.id)}
								onContextMenu={(e) => {
									e.preventDefault();
									props.systray.onRightClick(icon.id);
								}}
							>
								<img class="systray-icon" src={icon.iconUrl} />
							</div>
						)}
					</For>
				</div>
			)}

			<button class="systray-toggle" onClick={() => setExpanded(!expanded())}>
				<span></span>
			</button>
		</div>
	);
};

export default Systray;
