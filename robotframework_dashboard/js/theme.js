import { set_local_storage_item } from "./localstorage.js";
import { setup_dashboard_graphs } from "./graph_creation/all.js";
import { settings } from "./variables/settings.js";
import { graphFontSize } from "./variables/chartconfig.js";
import {
    githubLightSVG, githubDarkSVG,
    docsLightSVG, docsDarkSVG,
    settingsLightSVG, settingsDarkSVG,
    databaseLightSVG, databaseDarkSVG,
    filterLightSVG, filterDarkSVG,
    rflogoLightSVG, rflogoDarkSVG,
    moonSVG, sunSVG,
    bugLightSVG, bugDarkSVG,
    customizeViewLightSVG, customizeViewDarkSVG,
    saveLightSVG, saveDarkSVG,
    percentageLightSVG, percentageDarkSVG,
    barLightSVG, barDarkSVG,
    lineLightSVG, lineDarkSVG,
    pieLightSVG, pieDarkSVG,
    boxplotLightSVG, boxplotDarkSVG,
    heatmapLightSVG, heatmapDarkSVG,
    statsLightSVG, statsDarkSVG,
    timelineLightSVG, timelineDarkSVG,
    radarLightSVG, radarDarkSVG,
    fullscreenLightSVG, fullscreenDarkSVG,
    closeLightSVG, closeDarkSVG,
    informationLightSVG, informationDarkSVG,
    eyeLightSVG, eyeDarkSVG,
    eyeOffLightSVG, eyeOffDarkSVG,
    moveUpLightSVG, moveUpDarkSVG,
    moveDownLightSVG, moveDownDarkSVG,
    clockLightSVG, clockDarkSVG,
} from "./variables/svg.js";

// function to update the theme when the button is clicked
function toggle_theme() {
    if (document.documentElement.classList.contains("dark-mode")) {
        set_local_storage_item("theme", "light");
    } else {
        set_local_storage_item("theme", "dark");
    }
    setup_theme()
    setup_dashboard_graphs()
}

// theme function based on browser/machine color scheme
function setup_theme() {
    Chart.defaults.font.size = graphFontSize;
    const html = document.documentElement;

    function swap_button_classes(from1, to1, from2, to2) {
        // bootstrap buttons theme swap (outline and regular)
        document.querySelectorAll(from1).forEach(btn => {
            btn.classList.remove(from1.replace(".", ""));
            btn.classList.add(to1);
        });
        document.querySelectorAll(from2).forEach(btn => {
            btn.classList.remove(from2.replace(".", ""));
            btn.classList.add(to2);
        });
    }

    function set_light_mode() {
        // menu theme
        document.getElementById("navigation").classList.remove("navbar-dark")
        document.getElementById("navigation").classList.add("navbar-light")
        document.getElementById("themeLight").hidden = false;
        document.getElementById("themeDark").hidden = true;
        // bootstrap related settings
        document.getElementsByTagName("html")[0].setAttribute("data-bs-theme", "light");
        html.style.setProperty("--bs-body-bg", "#fff");
        swap_button_classes(".btn-outline-light", "btn-outline-dark", ".btn-light", "btn-dark");
        // chartjs default graph settings
        Chart.defaults.color = "#666";
        Chart.defaults.borderColor = "rgba(0,0,0,0.1)";
        Chart.defaults.backgroundColor = "rgba(0,0,0,0.1)";
        Chart.defaults.elements.line.borderColor = "rgba(0,0,0,0.1)";
        // svgs
        const svgMap = {
            ids: {
                "github": githubLightSVG,
                "docs": docsLightSVG,
                "settings": settingsLightSVG,
                "database": databaseLightSVG,
                "filters": filterLightSVG,
                "rflogo": rflogoLightSVG,
                "themeLight": moonSVG,
                "bug": bugLightSVG,
                "customizeLayout": customizeViewLightSVG,
                "saveLayout": saveLightSVG,
            },
            classes: {
                ".percentage-graph": percentageLightSVG,
                ".bar-graph": barLightSVG,
                ".line-graph": lineLightSVG,
                ".pie-graph": pieLightSVG,
                ".boxplot-graph": boxplotLightSVG,
                ".heatmap-graph": heatmapLightSVG,
                ".stats-graph": statsLightSVG,
                ".timeline-graph": timelineLightSVG,
                ".radar-graph": radarLightSVG,
                ".fullscreen-graph": fullscreenLightSVG,
                ".close-graph": closeLightSVG,
                ".information-icon": informationLightSVG,
                ".shown-graph": eyeLightSVG,
                ".hidden-graph": eyeOffLightSVG,
                ".shown-section": eyeLightSVG,
                ".hidden-section": eyeOffLightSVG,
                ".move-up-table": moveUpLightSVG,
                ".move-down-table": moveDownLightSVG,
                ".move-up-section": moveUpLightSVG,
                ".move-down-section": moveDownLightSVG,
                ".clock-icon": clockLightSVG,
            }
        };
        for (const [id, svg] of Object.entries(svgMap.ids)) {
            const el = document.getElementById(id);
            if (el) el.innerHTML = svg;
        }
        for (const [selector, svg] of Object.entries(svgMap.classes)) {
            document.querySelectorAll(selector).forEach(el => {
                el.innerHTML = svg;
            });
        }
    }

    function set_dark_mode() {
        // menu theme
        document.getElementById("themeLight").hidden = true;
        document.getElementById("themeDark").hidden = false;
        document.getElementById("navigation").classList.remove("navbar-light")
        document.getElementById("navigation").classList.add("navbar-dark")
        // bootstrap related settings
        document.getElementsByTagName("html")[0].setAttribute("data-bs-theme", "dark");
        html.style.setProperty("--bs-body-bg", "rgba(30, 41, 59, 0.9)");
        swap_button_classes(".btn-outline-dark", "btn-outline-light", ".btn-dark", "btn-light");
        // chartjs default graph settings
        Chart.defaults.color = "#eee";
        Chart.defaults.borderColor = "rgba(255,255,255,0.1)";
        Chart.defaults.backgroundColor = "rgba(255,255,0,0.1)";
        Chart.defaults.elements.line.borderColor = "rgba(255,255,0,0.4)";
        // svgs
        const svgMap = {
            ids: {
                "github": githubDarkSVG,
                "docs": docsDarkSVG,
                "settings": settingsDarkSVG,
                "database": databaseDarkSVG,
                "filters": filterDarkSVG,
                "rflogo": rflogoDarkSVG,
                "themeDark": sunSVG,
                "bug": bugDarkSVG,
                "customizeLayout": customizeViewDarkSVG,
                "saveLayout": saveDarkSVG,
            },
            classes: {
                ".percentage-graph": percentageDarkSVG,
                ".bar-graph": barDarkSVG,
                ".line-graph": lineDarkSVG,
                ".pie-graph": pieDarkSVG,
                ".boxplot-graph": boxplotDarkSVG,
                ".heatmap-graph": heatmapDarkSVG,
                ".stats-graph": statsDarkSVG,
                ".timeline-graph": timelineDarkSVG,
                ".radar-graph": radarDarkSVG,
                ".fullscreen-graph": fullscreenDarkSVG,
                ".close-graph": closeDarkSVG,
                ".information-icon": informationDarkSVG,
                ".shown-graph": eyeDarkSVG,
                ".hidden-graph": eyeOffDarkSVG,
                ".shown-section": eyeDarkSVG,
                ".hidden-section": eyeOffDarkSVG,
                ".move-up-table": moveUpDarkSVG,
                ".move-down-table": moveDownDarkSVG,
                ".move-up-section": moveUpDarkSVG,
                ".move-down-section": moveDownDarkSVG,
                ".clock-icon": clockDarkSVG,
            }
        };
        for (const [id, svg] of Object.entries(svgMap.ids)) {
            const el = document.getElementById(id);
            if (el) el.innerHTML = svg;
        }
        for (const [selector, svg] of Object.entries(svgMap.classes)) {
            document.querySelectorAll(selector).forEach(el => {
                el.innerHTML = svg;
            });
        }
    }

    // detect theme preference
    const isDark = html.classList.contains("dark-mode");

    if (settings.theme === "light") {
        if (isDark) html.classList.remove("dark-mode");
        set_light_mode();
    } else if (settings.theme === "dark") {
        if (!isDark) html.classList.add("dark-mode");
        set_dark_mode();
    } else {
        // No theme in localStorage, fall back to system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            html.classList.add("dark-mode");
            set_dark_mode();
        } else {
            html.classList.remove("dark-mode");
            set_light_mode();
        }
    }
}

export {
    toggle_theme,
    setup_theme
};