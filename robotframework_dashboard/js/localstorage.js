import { add_alert } from "./common.js";
import { settings } from "./constants/settings.js";
import { json_config, admin_json_config } from "./constants/globals.js";

// function to setup localstorage on first load
function setup_local_storage() {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
        try {
            const parsedSettings = JSON.parse(storedSettings);
            settings = merge_deep(parsedSettings, settings);
        } catch (e) {
            add_alert(`Failed to parse settings from localStorage: ${e}. Resetting settings to defaults.`, "danger");
        }
        localStorage.setItem('settings', JSON.stringify(settings));
    } else if (typeof json_config != "string") {
        settings = json_config
        localStorage.setItem('settings', JSON.stringify(json_config));
    } else if (typeof admin_json_config != "string" && Object.keys(admin_json_config).length != 0) {
        settings = admin_json_config
        localStorage.setItem('settings', JSON.stringify(settings));
    } else {
        localStorage.setItem('settings', JSON.stringify(settings));
    }
}

// function to set an item in localstorage based on a dot-separated path
function set_local_storage_item(path, value) {
    set_nested_setting(settings, path, value);
    localStorage.setItem('settings', JSON.stringify(settings));
}

// function to set a nested setting based on a dot-separated path
function set_nested_setting(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let deep = obj;
    keys.forEach(k => {
        if (!deep.hasOwnProperty(k) || typeof deep[k] !== 'object') {
            deep[k] = {};
        }
        deep = deep[k];
    });
    deep[lastKey] = value;
}

// function to merge two settings objects deeply, removing keys missing from defaults
function merge_deep(local, defaults) {
    const result = {};
    for (const key of new Set([...Object.keys(defaults), ...Object.keys(local)])) {
        const defaultVal = defaults[key];
        const localVal = local[key];
        // Removed key: exists in local but not in defaults — EXCEPT layout, libraries and theme (only in localstorage)
        if (key !== "layouts" && key !== "libraries" && key !== "theme" && defaultVal === undefined && localVal !== undefined) {
            continue;
        }
        // Added key: exists in defaults but not local: add defaults
        if (defaultVal !== undefined && localVal === undefined) {
            result[key] = structuredClone(defaultVal);
            continue;
        }
        // Present in both - use local, but merge where required
        if (key === "view") {
            result[key] = merge_view(localVal, defaultVal);
        }
        else if (key === "layouts") {
            result[key] = merge_layout(localVal, defaults);
        }
        else if (isObject(localVal) && isObject(defaultVal)) {
            result[key] = merge_objects_base(localVal, defaultVal);
        }
        else {
            result[key] = structuredClone(localVal);
        }
    }
    return result;
}

function isObject(v) {
    return v && typeof v === "object" && !Array.isArray(v);
}

// function to merge two objects recursively, removing keys missing from defaults
function merge_objects_base(local, defaults) {
    const merged = {};
    for (const key of new Set([...Object.keys(defaults), ...Object.keys(local)])) {
        // Remove keys missing from defaults
        if (!(key in defaults)) continue;
        // Add missing defaults
        if (!(key in local)) {
            merged[key] = structuredClone(defaults[key]);
            continue;
        }
        // Both exist
        if (isObject(local[key]) && isObject(defaults[key])) {
            merged[key] = merge_objects_base(local[key], defaults[key]);
        } else {
            merged[key] = structuredClone(local[key]);
        }
    }
    return merged;
}

// function to merge view from localstorage with defaults from settings
function merge_view(localView, defaultView) {
    const result = {};
    for (const page of Object.keys(defaultView)) {
        const defaultPage = defaultView[page];
        const localPage = localView[page] || {};
        result[page] = {
            sections: merge_view_section_or_graph(
                localPage.sections || {},
                defaultPage.sections
            ),
            graphs: merge_view_section_or_graph(
                localPage.graphs || {},
                defaultPage.graphs
            )
        };
    }
    return result;
}

// function to merge view sections or graphs from localstorage with defaults from settings
function merge_view_section_or_graph(local, defaults) {
    const result = { show: [], hide: [] };
    const allowed = new Set([
        ...defaults.show,
        ...defaults.hide
    ]);
    const localShow = new Set(local.show || []);
    const localHide = new Set(local.hide || []);
    // 1. Remove values not in defaults (allowed)
    for (const val of [...localShow]) {
        if (!allowed.has(val)) localShow.delete(val);
    }
    for (const val of [...localHide]) {
        if (!allowed.has(val)) localHide.delete(val);
    }
    // 2. Add missing defaults: always added to SHOW
    for (const val of allowed) {
        if (!localShow.has(val) && !localHide.has(val)) {
            localShow.add(val);
        }
    }
    // 3. Keep original placement of values already present
    result.show = [...localShow];
    result.hide = [...localHide];
    return result;
}

// function to merge layout from localstorage with allowed graphs from settings
function merge_layout(localLayout, mergedDefaults) {
    if (!localLayout) return localLayout;
    const result = structuredClone(localLayout);
    const allowedGraphs = collect_allowed_graphs(mergedDefaults);
    for (const key of Object.keys(result)) {
        try {
            const arr = JSON.parse(result[key]);
            // keep only entries whose IDs still exist
            const filtered = arr.filter(item =>
                allowedGraphs.has(item.id)
            );
            result[key] = JSON.stringify(filtered);
        } catch (e) {
            console.warn("Invalid layout JSON for section:", key, e);
            delete result[key];
        }
    }
    return result;
}

// collect all allowed graph IDs from the settings
function collect_allowed_graphs(settings) {
    const allowed = new Set();
    const extract = (obj) => {
        if (!obj) return;
        for (const key of ["show", "hide"]) {
            if (Array.isArray(obj[key])) {
                for (const g of obj[key]) allowed.add(g);
            }
        }
    };
    if (settings.view.dashboard) extract(settings.view.dashboard.graphs);
    if (settings.view.compare) extract(settings.view.compare.graphs);
    return allowed;
}

// function to update the localstorage and graphs for the suitepath switches
function update_switch_local_storage(key, state, firstLoad = false) {
    const id = key.split('.').map((part, index) => {
        if (index === 0) return part;
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join('');
    const currentState = key.split('.').reduce((o, i) => o[i], settings)
    if (firstLoad) {
        if (currentState !== undefined) {
            set_local_storage_item(key, currentState); // Ensure internal settings var is updated
            document.getElementById(id).checked = currentState;
        } else {
            set_local_storage_item(key, state); // If no value exists yet, default to current 'state' and save it
            document.getElementById(id).checked = state;
        }
    } else {
        set_local_storage_item(key, state);
    }
}

// function to update the localstorage of the graphtypes
function update_graph_type(graph, type) {
    settings.graphTypes[graph] = type;
    set_local_storage_item('graphTypes', settings.graphTypes);
}

export {
    setup_local_storage,
    set_local_storage_item,
    set_nested_setting,
    update_switch_local_storage,
    update_graph_type
};