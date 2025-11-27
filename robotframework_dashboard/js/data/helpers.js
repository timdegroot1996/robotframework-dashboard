import { settings } from "../constants/settings.js";
import { barConfig } from "../constants/config.js";
import { inFullscreen}  from "../constants/globals.js";

// helper function to more easily use the logic of filtering suite graph data based on the selected filters
// returns true if the value should be excluded, false if it should be included
function exclude_from_suite_data(dataType, value) {
    if (dataType !== "suite") return false;
    const suiteSelectSuites = document.getElementById("suiteSelectSuites").value;
    const suiteSelectSuitesOptions = [...document.getElementById("suiteSelectSuites").options].map(o => o.value);
    const suiteFolder = document.getElementById("suiteFolder").innerText;
    const isFolderAll = suiteFolder === "All";
    const isSuiteAll = suiteSelectSuites === "All Suites Separate" || suiteSelectSuites === "All Suites Combined";
    const usingSuitePaths = settings.switch.suitePathsSuiteSection;

    const folderMatches = (val) => val.full_name === suiteFolder || val.full_name.startsWith(`${suiteFolder}.`);
    const suiteNameMatches = (val) => suiteSelectSuitesOptions.includes(val.name);
    const fullNameMatches = (val) => suiteSelectSuitesOptions.includes(val.full_name);

    if (isFolderAll && isSuiteAll) {
        // All folders, all suites: include all
        return false;
    }
    if (isFolderAll && !isSuiteAll) {
        // All folders, specific suite
        return usingSuitePaths
            ? value.full_name !== suiteSelectSuites
            : value.name !== suiteSelectSuites;
    }
    if (!isFolderAll && isSuiteAll) {
        // Specific folder, all suites
        if (!folderMatches(value)) return true;

        return usingSuitePaths
            ? !fullNameMatches(value)
            : !suiteNameMatches(value);
    }
    // Specific folder, specific suite
    if (!folderMatches(value)) return true;
    return usingSuitePaths
        ? value.full_name !== suiteSelectSuites
        : value.name !== suiteSelectSuites;
}

// function to update the height of the test statistics graph and enable scrolling
function update_height(verticalId, labels, graphType, internal = false) {
    const vertical = document.getElementById(verticalId);
    if (!internal) {
        if (vertical.closest(".grid-stack-item")) { // if item is not hidden add resize observer
            const observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    update_height(verticalId, labels, graphType, true);
                    window[verticalId.replace("Vertical", "Graph")].resize();
                }
            });
            observer.observe(vertical.closest(".grid-stack-item"));
        }
    }
    const fullscreen = vertical.closest(".grid-stack-item-content")
    if (!fullscreen) return; // return if item is hidden
    var baseHeight = parseFloat(getComputedStyle(fullscreen).height);
    if (inFullscreen) {
        baseHeight = baseHeight - 103;
    } else { // fix for not in fullscreen take off the svg row and padding
        baseHeight = baseHeight - 72;
    }
    vertical.style.height = `${baseHeight}px`;
    if (labels > 10 && graphType != "bar") {
        const newHeight = baseHeight + (labels - 10) * 35;
        if (inFullscreen && newHeight < baseHeight) {
            vertical.style.height = `${baseHeight}px`;
        } else {
            vertical.style.height = `${newHeight}px`;
        }
    } else {
        vertical.style.height = `${baseHeight}px`;
    }
}

// function to convert timeline data to improve performance
function convert_timeline_data(oldDatasets) {
    const grouped = {};
    for (const dataset of oldDatasets) {
        const segment = dataset.data[0]; // assumes 1 item per dataset
        const status = `${dataset.label}:*:&:.:${dataset.backgroundColor}:*:&:.:${dataset.borderColor}`;
        if (!grouped[status]) {
            grouped[status] = [];
        }
        grouped[status].push({
            x: segment.x,
            y: segment.y,
        });
    }
    const data = Object.entries(grouped)
        .filter(([_, data]) => data.length > 0)
        .map(([status, data]) => ({
            label: status.split(":*:&:.:")[0],
            data,
            backgroundColor: status.split(":*:&:.:")[1],
            borderColor: status.split(":*:&:.:")[2],
            ...barConfig,
            parsing: true
        }));
    return data
}

export {
    exclude_from_suite_data,
    update_height,
    convert_timeline_data
};