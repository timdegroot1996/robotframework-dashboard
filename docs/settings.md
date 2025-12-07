---
outline: deep
---

# Settings

RobotFramework Dashboard includes a fully customizable configuration system that controls how the dashboard looks and behaves.  

## General

The settings are divided into **three tabs**:

1. **Graphs** – general dashboard and chart behavior  
2. **Keywords** – which keyword libraries appear in keyword graphs  
3. **JSON** – direct editing of the full JSON config for advanced users  

##  Theme

The dashboard can be displayed in **light mode** or **dark mode**.  
This setting is applied globally across all dashboard pages and graphs.
This can be set through the sun/moon icon in the menu bar.

## General Settings (Graphs Tab)

The **Graphs** tab contains the core configuration options for all charts in the dashboard. These settings influence how the dashboard is generated and how graphs are rendered.

### Details

| Setting | Description |
|--------|-------------|
| **Unified Dashboard Sections** | Show all dashboard sections in a single unified view. (Instead of run/suite/test/keyword separate) |
| **Display Legends** | Show or hide graph legends. Useful to disable this when graphs contain many series. |
| **Display Axis Titles** | Shows axis labels (e.g., *Run Time*, *Pass/Fail Count*). Disable for a cleaner look. |
| **Display Run Start/Alias Labels On Axes** | Enables labels directly on graph axes. Disable for a cleaner look. |
| **Display Alias Labels** | Labels graphs using **aliases** instead of the default *run_start*. |
| **Display Milliseconds Run Start Labels** | Adds millisecond precision to run_start timestamps. |
| **Display Drawing Animations** | Enables animated graph rendering. |
| **Animation Duration (Milliseconds)** | Length of animation, e.g. `1500` ms. |
| **Bar Gdraph Edge Rouning (Pixels)** | Controls rounding of bar edges (e.g., `0` = square, `8` = softer). |

### Saving Settings

- Press **Close** or click outside the modal -> **settings are saved automatically**
- No need to manually apply changes for the **Graphs** tab

## Keyword Settings (Keywords Tab)

The **Keywords** tab controls which libraries appear inside the Keyword Graphs.  
This allows you to include or exclude specific libraries based on your dashboard needs.

### Details

- A list of discovered libraries is shown  
- Each library has an **enable/disable toggle**  
- Disabled libraries will **not** appear in the keyword section  
- Enabled libraries remain fully visible and included in statistics  

### Saving Keyword Settings

- Closing the modal **automatically saves** your keyword selections  
- No need to press additional buttons in this tab

## JSON Settings (JSON Tab)

For advanced use cases, you can directly edit the internal settings JSON.  
This allows complete control over:

- Section ordering  
- Graph ordering  
- Graph sizes  
- Switch toggles  
- Display toggles  
- Keyword configuration  
- Animation settings  
- Theme and visual preferences  

> **Tip:** See [Advanced CLI](/advanced-cli-examples.html#using-a-custom-dashboard-config-json) for sharing a default config with team members!

### Details

- The “Current Settings JSON” textfield shows the current configuration  
- You may edit it directly to modify any setting  
- Available options:
  - **Copy Settings JSON** — copies the settings JSON to clipboard
  - **Apply Settings JSON** — applies the content of the JSON box  
  - **Reset Settings JSON** — resets the JSON to default values
- Pressing **Close** will *not* apply changes in this tab
