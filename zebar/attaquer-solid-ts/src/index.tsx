/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { createStore } from "solid-js/store";
import * as zebar from "zebar";
import Workspaces from "./Workspaces/Workspace";
import CurrentApps from "./CurrentApps/CurrentApps";
import Systray from "./Systray/Systray";

const providers = zebar.createProviderGroup({
	glazewm: { type: "glazewm" },
	cpu: { type: "cpu", refreshInterval: 3000 },
	memory: { type: "memory", refreshInterval: 5000 },
	weather: { type: "weather" },
	network: { type: "network", refreshInterval: 2000 },
	battery: { type: "battery", refreshInterval: 10000 },
	date: { type: "date", formatting: "HH:mm ccc d LLLL " },
	media: { type: "media" },
	audio: { type: "audio" },
	systray: { type: "systray" },
});

render(() => <App />, document.getElementById("root")!);

function App() {
	function getBatteryIcon(batteryOutput) {
		if (batteryOutput.chargePercent > 90) return <i class="nf nf-fa-battery_4"></i>;
		if (batteryOutput.chargePercent > 70) return <i class="nf nf-fa-battery_3"></i>;
		if (batteryOutput.chargePercent > 40) return <i class="nf nf-fa-battery_2"></i>;
		if (batteryOutput.chargePercent > 20) return <i class="nf nf-fa-battery_1"></i>;
		return <i class="nf nf-fa-battery_0"></i>;
	}

	function getWeatherIcon(weatherOutput) {
		switch (weatherOutput.status) {
			case "clear_day":
				return <i class="nf nf-weather-day_sunny"></i>;
			case "clear_night":
				return <i class="nf nf-weather-night_clear"></i>;
			case "cloudy_day":
				return <i class="nf nf-weather-day_cloudy"></i>;
			case "cloudy_night":
				return <i class="nf nf-weather-night_alt_cloudy"></i>;
			case "light_rain_day":
				return <i class="nf nf-weather-day_sprinkle"></i>;
			case "light_rain_night":
				return <i class="nf nf-weather-night_alt_sprinkle"></i>;
			case "heavy_rain_day":
				return <i class="nf nf-weather-day_rain"></i>;
			case "heavy_rain_night":
				return <i class="nf nf-weather-night_alt_rain"></i>;
			case "snow_day":
				return <i class="nf nf-weather-day_snow"></i>;
			case "snow_night":
				return <i class="nf nf-weather-night_alt_snow"></i>;
			case "thunder_day":
				return <i class="nf nf-weather-day_lightning"></i>;
			case "thunder_night":
				return <i class="nf nf-weather-night_alt_lightning"></i>;
		}
	}
	function getNetworkIcon(networkOutput) {
		switch (networkOutput.defaultInterface?.type) {
			case "ethernet":
				return <i class="nf nf-md-ethernet_cable"></i>;
			case "proprietary_virtual":
				return <i class="nf nf-md-shield_lock_outline"></i>;
			case "wifi":
				if (networkOutput.defaultGateway?.signalStrength >= 80) {
					return <i class="nf nf-md-wifi_strength_4"></i>;
				} else if (networkOutput.defaultGateway?.signalStrength >= 65) {
					return <i class="nf nf-md-wifi_strength_3"></i>;
				} else if (networkOutput.defaultGateway?.signalStrength >= 40) {
					return <i class="nf nf-md-wifi_strength_2"></i>;
				} else if (networkOutput.defaultGateway?.signalStrength >= 25) {
					return <i class="nf nf-md-wifi_strength_1"></i>;
				} else {
					return <i class="nf nf-md-wifi_strength_outline"></i>;
				}
			default:
				return <i class="nf nf-md-wifi_strength_off_outline"></i>;
		}
	}
	const [output, setOutput] = createStore(providers.outputMap);
	providers.onOutput((outputMap) => setOutput(outputMap));
	return (
		<div class="app">
			<div class="left">
				<i class="launcher nf nf-md-robot_love"
				onclick={() => output.glazewm.runCommand("shell-exec %LOCALAPPDATA%\\FlowLauncher\\Flow.Launcher.exe")}
				></i>
				<Workspaces glazewm={output.glazewm} />
			</div>
			<div class="center">
				<CurrentApps glazewm={output.glazewm} />
			</div>
			<div class="right">
				{output.glazewm?.isPaused && (
					<button
						class="paused-button"
						onClick={() => output.glazewm.runCommand("wm-toggle-pause")}
					>
						PAUSED
					</button>
				)}
				<Systray systray={output.systray} glazewm={output.glazewm} />
				<button
					class={`tiling-direction nf ${
						output.glazewm?.tilingDirection === "horizontal"
							? "nf-md-swap_horizontal"
							: "nf-md-swap_vertical"
					}`}
					onClick={() => output.glazewm.runCommand("toggle-tiling-direction")}
				></button>
				{output.network && (
					<div class="network">
						{getNetworkIcon(output.network)}
						{output.network.defaultGateway?.ssid}
					</div>
				)}

				{output.memory && (
					<div class="memory">
						<i class="nf nf-fae-chip"></i>
						{Math.round(output.memory.usage)}%
					</div>
				)}

				{output.cpu && (
					<div class="cpu">
						<i class="nf nf-oct-cpu"></i>

						<span class={output.cpu.usage > 85 ? "high-usage" : ""}>
							{Math.round(output.cpu.usage)}%
						</span>
					</div>
				)}
				{output.battery && (
					<div class="battery">
						{/* Show icon for whether battery is charging. */}
						{output.battery.isCharging && <i class="nf nf-md-power_plug charging-icon"></i>}
						{getBatteryIcon(output.battery)}
						{Math.round(output.battery.chargePercent)}%
					</div>
				)}

				{output.weather && (
					<div class="weather">
						{getWeatherIcon(output.weather)}
						{Math.round(output.weather.celsiusTemp)}°C
					</div>
				)}

				<div style="font-size: 12px; line-height: 1; white-space: nowrap;">
					{output.date?.formatted}
				</div>
			</div>
		</div>
	);
}
