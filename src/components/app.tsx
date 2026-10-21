import { calculateScreenSize, parseGrubTheme } from "@/helper.js";
import GrubScreen from "@/components/grub_screen.js";
import {
  AssetContext,
  createAssetResolver,
  type AssetResolver,
} from "@/asset_context.js";
import { useState, useMemo, useEffect, type ChangeEvent } from "react";
import osEntriesArray from "@/assets/os_entries.example.json" with { type: "json" };

const SUPPORTED_COMPONENTS = ["label", "image", "boot_menu"];

export default function App() {
  const screenSizeOptions = useMemo(
    () => [
      ...new Set([
        "640x480",
        "800x600",
        "1024x768",
        "1280x720",
        "1280x1024",
        "1366x768",
        "1600x900",
        "1920x1080",
        "2560x1440",
        `${screen.width}x${screen.height}`,
      ]),
    ],
    [],
  );

  const [configuration, setConfiguration] = useState("");
  const [osEntriesText, setOsEntriesText] = useState(osEntriesArray.join("\n"));
  const [screenSize, setScreenSize] = useState("800x600");
  const [assetFiles, setAssetFiles] = useState(new Map<string, string>());

  const theme = useMemo(() => parseGrubTheme(configuration), [configuration]);
  const osEntries = useMemo(
    () => osEntriesText.split("\n").filter((entry) => entry.trim() !== ""),
    [osEntriesText],
  );
  const resolver: AssetResolver = useMemo(
    () => createAssetResolver(assetFiles),
    [assetFiles],
  );
  const warnings = useMemo(() => {
    const unsupported = theme.components
      .map((c) => c.type.toLowerCase())
      .filter((type) => !SUPPORTED_COMPONENTS.includes(type));
    return [
      ...theme.warnings,
      ...[...new Set(unsupported)].map(
        (type) => `Component "${type}" is not supported yet`,
      ),
    ];
  }, [theme]);

  // release object URLs of the previously loaded theme folder
  useEffect(
    () => () => assetFiles.forEach((url) => URL.revokeObjectURL(url)),
    [assetFiles],
  );

  async function loadThemeFolder(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const next = new Map<string, string>();
    let themeFile: File | undefined;
    for (const file of files) {
      // drop the leading folder name: "mytheme/icons/a.png" -> "icons/a.png"
      const relative = file.webkitRelativePath.split("/").slice(1).join("/");
      next.set(relative, URL.createObjectURL(file));
      if (relative === "theme.txt") themeFile = file;
    }
    setAssetFiles(next);
    if (themeFile) setConfiguration(await themeFile.text());
  }

  return (
    <>
      <header>
        <h1>GRUB Theme Visualizer</h1>
        <p>Preview a GRUB2 theme before installing it.</p>
      </header>
      <main>
        <aside id="controls">
          <section>
            <label htmlFor="themeFolder">Theme folder</label>
            <input
              id="themeFolder"
              type="file"
              // @ts-expect-error non-standard directory picker attribute
              webkitdirectory=""
              onChange={(e) => void loadThemeFolder(e)}
            />
            <span className="hint">
              Pick the folder that contains theme.txt. Files stay in your
              browser.
            </span>
          </section>
          <section>
            <label htmlFor="configuration">Configuration</label>
            <textarea
              id="configuration"
              rows={22}
              spellCheck={false}
              value={configuration}
              placeholder="Load a theme folder above, or paste a theme.txt here"
              onChange={(e) => setConfiguration(e.target.value)}
            ></textarea>
            {warnings.length > 0 && (
              <ul id="warnings">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <label htmlFor="osEntries">OS entries</label>
            <textarea
              id="osEntries"
              rows={4}
              spellCheck={false}
              value={osEntriesText}
              onChange={(e) => setOsEntriesText(e.target.value)}
            ></textarea>
            <span className="hint">
              One per line. Use ↑ ↓ to move the selection.
            </span>
          </section>
          <section>
            <label htmlFor="screenSize">Screen size</label>
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
          </section>
        </aside>

        <div className="preview">
          <AssetContext value={resolver}>
            <GrubScreen
              theme={theme}
              osEntries={osEntries}
              screenSize={calculateScreenSize(screenSize)}
            />
          </AssetContext>
        </div>
      </main>
    </>
  );
}
