import { settings } from "./settings.js";

// Helper function to convert hex to rgba with opacity
function hexToRgba(hex, alpha) {
    // Handle hex colors
    if (hex.startsWith('#')) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // If already rgba, return as is
    return hex;
}

// Function to get color values based on current theme
function getThemeBasedColors() {
    const root = document.documentElement;
    const isDarkMode = root.classList.contains("dark-mode");
    const themeMode = isDarkMode ? 'dark' : 'light';
    
    // Get default colors for current theme mode
    const defaultColors = settings.theme_colors[themeMode];
    
    // Get custom colors if they exist
    const customColors = settings.theme_colors?.custom?.[themeMode] || {};
    
    // Return final colors (custom overrides default)
    const passed = customColors.passed || defaultColors.passed;
    const skipped = customColors.skipped || defaultColors.skipped;
    const failed = customColors.failed || defaultColors.failed;
    
    return {
        passedBackgroundBorderColor: passed,
        passedBackgroundColor: hexToRgba(passed, 0.7),
        skippedBackgroundBorderColor: skipped,
        skippedBackgroundColor: hexToRgba(skipped, 0.7),
        failedBackgroundBorderColor: failed,
        failedBackgroundColor: hexToRgba(failed, 0.7),
    };
}

// Get initial colors
const colors = getThemeBasedColors();

// colors
const passedBackgroundBorderColor = colors.passedBackgroundBorderColor;
const passedBackgroundColor = colors.passedBackgroundColor;
const skippedBackgroundBorderColor = colors.skippedBackgroundBorderColor;
const skippedBackgroundColor = colors.skippedBackgroundColor;
const failedBackgroundBorderColor = colors.failedBackgroundBorderColor;
const failedBackgroundColor = colors.failedBackgroundColor;
const greyBackgroundBorderColor = "#0f172a";
const greyBackgroundColor = "rgba(33, 37, 41, 0.7)";
const blueBackgroundBorderColor = "rgba(54, 162, 235)";
const blueBackgroundColor = "rgba(54, 162, 235, 0.5)";
const graphFontSize = 12;

// base bar config
const barConfig = {
    borderSkipped: false,
    borderRadius: () => {
        return {
            topLeft: settings.show.rounding,
            topRight: settings.show.rounding,
            bottomLeft: settings.show.rounding,
            bottomRight: settings.show.rounding
        };
    }
};
const passedConfig = {
    backgroundColor: passedBackgroundColor,
    borderColor: passedBackgroundBorderColor,
    ...barConfig,
}
const failedConfig = {
    backgroundColor: failedBackgroundColor,
    borderColor: failedBackgroundBorderColor,
    ...barConfig,
}
const skippedConfig = {
    backgroundColor: skippedBackgroundColor,
    borderColor: skippedBackgroundBorderColor,
    ...barConfig,
}
const blueConfig = {
    backgroundColor: blueBackgroundColor,
    borderColor: blueBackgroundBorderColor,
    ...barConfig,
}
// base line config
const lineConfig = {
    tension: 0.1,
    pointRadius: 4,
    pointHoverRadius: 6
}
// data label background rectangle config
const dataLabelConfig = {
    color: "#eee",
    backgroundColor: function (context) {
        return "rgba(0, 0, 0, 0.6)";
    },
    borderRadius: 4,
    padding: 3,
    align: "center",
    anchor: "center",
    font: {
        size: graphFontSize,
    },
}

export {
    passedBackgroundBorderColor,
    passedBackgroundColor,
    skippedBackgroundBorderColor,
    skippedBackgroundColor,
    failedBackgroundBorderColor,
    failedBackgroundColor,
    greyBackgroundBorderColor,
    greyBackgroundColor,
    blueBackgroundBorderColor,
    blueBackgroundColor,
    graphFontSize,
    barConfig,
    passedConfig,
    failedConfig,
    skippedConfig,
    blueConfig,
    lineConfig,
    dataLabelConfig,
    getThemeBasedColors
};