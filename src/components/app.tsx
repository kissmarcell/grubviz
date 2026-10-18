import { calculateScreenSize, parseGrubTheme } from "@/helper.js";
import GrubScreen from "@/components/grub_screen.js";
import { useState, useMemo } from "react";
// @ts-expect-error raw import
import configurationText from "@/assets/theme.example.txt?raw";
import osEntriesArray from "@/assets/os_entries.example.json" with { type: "json" };

export default function App() {
  const screenSizeOptions = useMemo(
    () => [
      "800x600",
      "640x480",
      "1024x768",
      `${screen.width}x${screen.height}`,
    ],
    [],
  );

  const [configuration, setConfiguration] = useState(configurationText);
  const [osEntries, setOsEntries] = useState(osEntriesArray);
  const [screenSize, setScreenSize] = useState(screenSizeOptions[0]);

  return (
    <>
      <header>GRUB Theme Visualizer — drop a theme file or load sample</header>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <div
          id="controls"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <label className="small">GRUB configuration:</label>
          <textarea
            style={{ backgroundColor: "#9e9e9eff" }}
            id="configuration"
            rows={30}
            cols={80}
            value={configuration}
            onChange={(e) => setConfiguration(e.target.value)}
          ></textarea>
          <label className="small">OS Entries (one per line):</label>
          <textarea
            style={{ backgroundColor: "#9e9e9eff" }}
            id="osEntries"
            rows={4}
            value={osEntries.join("\n")}
            onChange={(e) => setOsEntries(e.target.value.split("\n"))}
          ></textarea>
          <label className="small">Screen:</label>
          <select
            id="screenSize"
            value={screenSize}
            onChange={(e) => setScreenSize(e.target.value)}
          >
            {screenSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <GrubScreen
          theme={parseGrubTheme(configuration)}
          osEntries={osEntries}
          screenSize={calculateScreenSize(screenSize)}
        />
      </div>
    </>
  );
}
