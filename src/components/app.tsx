import { calculateScreenSize, parseGrubTheme } from '../helper.js';
import GrubScreen from './grub_screen.js';
import { useState, useMemo } from 'react';

export default function App() {
    const osEntriesArray = ['Fedora', 'Ubuntu', 'Windows 10', 'Memtest86+'];
    const configurationText = `# Global Property
title-text: ""
desktop-image: "https://raw.githubusercontent.com/catppuccin/grub/refs/heads/main/src/catppuccin-mocha-grub-theme/background.png"
desktop-image-scale-method: "stretch"
desktop-color: "#1E1E2E"
terminal-font: "Unifont Regular 16"
terminal-left: "0"
terminal-top: "0"
terminal-width: "100%"
terminal-height: "100%"
terminal-border: "0"

# Logo image
+ image {
    left = 50%-80
    top = 30%-80
    file = "https://em-content.zobj.net/source/apple/354/shaking-face_1fae8.png"
}

# Show the boot menu
+ boot_menu {
    left = 50%-240
    top = 40%
    width = 480
    height = 30%
    item_font = "Unifont Regular 16"
    item_color = "#CDD6F4"
    selected_item_color = "#CDD6F4"
    icon_width = 32
    icon_height = 32
    item_icon_space = 20
    item_height = 36
    item_padding = 5
    item_spacing = 10
    #selected_item_pixmap_style = "select_*.png"
}

# Show a countdown message using the label component
+ label {
    top = 82%
    left = 35%
    width = 30%
    align = "center"
    id = "__timeout__"
    text = "Booting in %d seconds"
    color = "#CDD6F4"
}`;
    const screenSizeOptions = useMemo(() => ['800x600', '640x480', '1024x768', `${screen.width}x${screen.height}`], []);


    const [configuration, setConfiguration] = useState(configurationText);
    const [osEntries, setOsEntries] = useState(osEntriesArray);
    const [screenSize, setScreenSize] = useState(screenSizeOptions[0]);

    return <>
        <header>GRUB Theme Visualizer — drop a theme file or load sample</header>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div id="controls" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <label className="small">GRUB configuration:</label>
                <textarea id="configuration" rows={20} cols={40} value={configuration} onChange={e => setConfiguration(e.target.value)}></textarea>
                <label className="small">OS Entries (one per line):</label>
                <textarea id="osEntries" rows={4} value={osEntries.join('\n')} onChange={e => setOsEntries(e.target.value.split('\n'))}></textarea>
                <label className="small">Screen:</label>
                <select id="screenSize" value={screenSize} onChange={e => setScreenSize(e.target.value)}>
                    {screenSizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>

            <GrubScreen theme={parseGrubTheme(configuration)} osEntries={osEntries} screenSize={calculateScreenSize(screenSize)} />
        </div>
    </>;
}