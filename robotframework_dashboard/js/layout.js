import { settings } from "./variables/settings.js";
import { set_local_storage_item } from "./localstorage.js";
import { graphMetadata } from "./variables/graphmetadata.js";
import { space_to_camelcase, add_alert } from "./common.js";
import { gridEditMode } from "./variables/globals.js";
import {
    gridrun,
    gridSuite,
    gridTest,
    gridKeyword,
    gridCompare
} from "./variables/globals.js"; // they are used in the window[grid] references
import { setup_data_and_graphs } from "./menu.js";

// function to order the sections according to the config
function setup_section_order() {
    document.getElementById("overview").hidden = !settings.menu.overview;
    document.getElementById("dashboard").hidden = !settings.menu.dashboard;
    document.getElementById("compare").hidden = !settings.menu.compare;
    document.getElementById("tables").hidden = !settings.menu.tables;
    let prevId = "#topSection";

    for (const section of settings.view.dashboard.sections.show) {
        const sectionId = space_to_camelcase(section + "Section");
        const sectionEl = document.getElementById(sectionId);
        sectionEl.hidden = false;
        $(`#${sectionId}`).insertAfter(prevId);
        prevId = `#${sectionId}`;
    }
    for (const section of settings.view.dashboard.sections.hide) {
        const sectionId = space_to_camelcase(section + "Section");
        const sectionEl = document.getElementById(sectionId);
        if (gridEditMode) {
            sectionEl.hidden = false;
            $(`#${sectionId}`).insertAfter(prevId);
            prevId = `#${sectionId}`;
        } else {
            sectionEl.hidden = true;
        }
    }

    if (gridEditMode) {
        document.querySelectorAll(".move-up-section").forEach(btn => { btn.hidden = false })
        document.querySelectorAll(".move-down-section").forEach(btn => { btn.hidden = false })
        document.querySelectorAll(".shown-section, .hidden-section").forEach(btn => {
            const prefix = btn.id.slice(0, 3);
            const label = prefix.charAt(0).toUpperCase()
            var shouldShow = false;
            for (const section of settings.view.dashboard.sections.show) {
                if (section.startsWith(label)) {
                    shouldShow = true;
                    break
                }
            }
            if (btn.classList.contains("shown-section")) {
                btn.hidden = !shouldShow;
            } else if (btn.classList.contains("hidden-section")) {
                btn.hidden = shouldShow;
            }
        });
    } else {
        document.querySelectorAll(".move-up-section").forEach(btn => { btn.hidden = true })
        document.querySelectorAll(".move-down-section").forEach(btn => { btn.hidden = true })
        document.querySelectorAll(".shown-section").forEach(btn => { btn.hidden = true })
        document.querySelectorAll(".hidden-section").forEach(btn => { btn.hidden = true })
    }
}

// function to order the grphs according to the localstorage config
function setup_graph_order() {
    setup_grid_graphs("Run")
    setup_grid_graphs("Suite")
    setup_grid_graphs("Test")
    setup_grid_graphs("Keyword")
    setup_grid_graphs("Compare")
    setup_tables()
}

function setup_grid_graphs(section) {
    const grid = `grid${section}`
    if (!window[grid] || typeof window[grid].destroy !== 'function') {
        const gridElement = document.getElementById(grid)
        window[grid] = GridStack.init({
            cellHeight: 100,
            float: false,
            resizable: { handles: 'all' }
        }, gridElement);
    } else {
        window[grid].destroy();
        const parentElement = document.getElementById(`${section.toLowerCase()}StatisticsSection`);
        const htmlToInsert = `<div class="card-body grid-stack" id="grid${section}"></div>`;
        parentElement.insertAdjacentHTML('beforeend', htmlToInsert);
        const gridElement = document.getElementById(grid)
        window[grid] = GridStack.init({
            cellHeight: 100,
            float: false,
            resizable: { handles: 'all' }
        }, gridElement);
    }
    if (!gridEditMode) window[grid].disable();

    const lowerCaseSection = section.toLowerCase();
    const sectionDataHidden = document.getElementById(lowerCaseSection + "DataHidden");
    if (sectionDataHidden.children.length > 0) {
        sectionDataHidden.innerHTML = "";
    }

    const graphShow = [...settings.view.dashboard.graphs.show, ...settings.view.compare.graphs.show]
    const graphHide = [...settings.view.dashboard.graphs.hide, ...settings.view.compare.graphs.hide]

    if (settings.layouts && settings.layouts[`${grid}`]) {
        const savedLayout = JSON.parse(settings.layouts[`${grid}`]);
        if (gridEditMode) {
            for (const graph of graphShow) {
                if (graph.startsWith(section)) {
                    const layout = savedLayout.find(g => g.id === graph);
                    if (layout) {
                        add_graph(layout.id, layout.x, layout.y, layout.w, layout.h, true);
                    } else {
                        add_graph(graph, undefined, undefined, 4, 4, true);
                    }
                }
            }
            for (const graph of graphHide) {
                if (graph.startsWith(section)) {
                    const layout = savedLayout.find(g => g.id === graph);
                    if (layout) {
                        add_graph(layout.id, layout.x, layout.y, layout.w, layout.h, false);
                    } else {
                        add_graph(graph, undefined, undefined, 4, 4, false);
                    }
                }
            }
        } else {
            for (const graph of graphShow) {
                if (graph.startsWith(section)) {
                    const layout = savedLayout.find(g => g.id === graph);
                    if (layout) {
                        add_graph(layout.id, layout.x, layout.y, layout.w, layout.h);
                    } else {
                        add_graph(graph, undefined, undefined, 4, 4);
                    }
                }
            }

            for (const graph of graphHide) {
                if (graph.startsWith(section)) {
                    add_hidden_graph(graph);
                }
            }
        }
    } else {
        const defaultWidth = 4;
        const defaultHeight = 4;
        const maxColumns = 12;
        let currentX = 0;
        let currentY = 0;

        if (gridEditMode) {
            for (const graph of graphShow) {
                if (graph.startsWith(section)) {
                    add_graph(graph, currentX, currentY, defaultWidth, defaultHeight, true);
                    currentX += defaultWidth;
                    if (currentX >= maxColumns) {
                        currentX = 0;
                        currentY += defaultHeight;
                    }
                }
            }
            for (const graph of graphHide) {
                if (graph.startsWith(section)) {
                    add_graph(graph, currentX, currentY, defaultWidth, defaultHeight, false);
                    currentX += defaultWidth;
                    if (currentX >= maxColumns) {
                        currentX = 0;
                        currentY += defaultHeight;
                    }
                }
            }
        } else {
            for (let graph of graphShow) {
                if (graph.startsWith(section)) {
                    add_graph(graph, currentX, currentY, defaultWidth, defaultHeight);
                    currentX += defaultWidth;
                    if (currentX >= maxColumns) {
                        currentX = 0;
                        currentY += defaultHeight;
                    }
                }
            }
            for (let graph of graphHide) {
                if (graph.startsWith(section) || graph.endsWith(section)) {
                    add_hidden_graph(graph);
                }
            }
        }
    }

    function add_graph(id, x, y, w, h, shown = true) {
        const item = document.createElement("div");
        item.classList.add("grid-stack-item");
        item.setAttribute("gs-x", x);
        item.setAttribute("gs-y", y);
        item.setAttribute("gs-w", w);
        item.setAttribute("gs-min-w", 3);
        item.setAttribute("gs-max-w", 12);
        item.setAttribute("gs-h", h);
        item.setAttribute("gs-min-h", 3);
        item.setAttribute("gs-max-h", 12);
        item.setAttribute("data-gs-id", id);

        // showGraphHidden, hideGraphHidden
        const graphConfig = graphMetadata.find(g => g.label == id);
        var html = `<div class="grid-stack-item-content">${graphConfig.html}</div>`;
        if (gridEditMode) {
            if (shown) {
                html = html.replace("showGraphHidden", "")
                html = html.replace("hideGraphHidden", "hidden")
            } else {
                html = html.replace("showGraphHidden", "hidden")
                html = html.replace("hideGraphHidden", "")
            }
        } else {
            html = html.replace("showGraphHidden", "hidden")
            html = html.replace("hideGraphHidden", "hidden")
        }
        item.innerHTML = html
        window[grid].makeWidget(item);
    }

    function add_hidden_graph(id) {
        sectionDataHidden.insertAdjacentHTML("beforeend", graphMetadata.find(g => g.label == id).html);
    }
}

function setup_tables() {
    const tableGrid = document.getElementById("gridTable")
    const tableHidden = document.getElementById("tableDataHidden")
    tableGrid.innerHTML = ''
    tableHidden.innerHTML = ''
    settings.view.tables.graphs.show.forEach(table => {
        var html = graphMetadata.find(g => g.label == table).html
        if (gridEditMode) {
            html = html
                .replace("showGraphHidden", "")
                .replace("hideGraphHidden", "hidden")
                .replace("moveUpHidden", "")
                .replace("moveDownHidden", "")
        } else {
            html = html
                .replace("showGraphHidden", "hidden")
                .replace("hideGraphHidden", "hidden")
                .replace("moveUpHidden", "hidden")
                .replace("moveDownHidden", "hidden")
        }
        tableGrid.insertAdjacentHTML('beforeend', html);
    });
    settings.view.tables.graphs.hide.forEach(table => {
        var html = graphMetadata.find(g => g.label == table).html
        if (gridEditMode) {
            html = html.replace("showGraphHidden", "hidden")
            html = html.replace("hideGraphHidden", "")
            html = html.replace("moveUpHidden", "")
            html = html.replace("moveDownHidden", "")
            tableGrid.insertAdjacentHTML('beforeend', html);
        } else {
            html = html.replace("showGraphHidden", "hidden")
            html = html.replace("hideGraphHidden", "hidden")
            html = html.replace("moveUpHidden", "hidden")
            html = html.replace("moveDownHidden", "hidden")
            tableHidden.insertAdjacentHTML('beforeend', html);
        }
    })
}

function customize_layout() {
    document.getElementById("customizeLayout").hidden = true;
    document.getElementById("saveLayout").hidden = false;
    add_alert("You can now change your layout. Don't forget to save!", "info")
}

function save_layout() {
    document.getElementById("customizeLayout").hidden = false;
    document.getElementById("saveLayout").hidden = true;
    const shownDashboardItems = [];
    const hiddenDashboardItems = [];
    const shownCompareItems = [];
    const hiddenCompareItems = [];
    // save dashboard/compare graph layout
    const grids = document.querySelectorAll(".grid-stack");
    grids.forEach(grid => {
        const layout = window[`${grid.id}`].engine.nodes.map(w => {
            const id = w.el?.getAttribute('data-gs-id');
            return {
                x: w.x,
                y: w.y,
                w: w.w,
                h: w.h,
                id
            };
        }).filter(w => w.id);
        if (layout.length > 0) {
            set_local_storage_item(`layouts.${grid.id}`, JSON.stringify(layout));
        }
        const shown = document.querySelectorAll(`#${grid.id} .shown-graph:not([hidden])`);
        const hidden = document.querySelectorAll(`#${grid.id} .hidden-graph:not([hidden])`);
        shown.forEach(btn => {
            if (grid.id.includes("Compare")) {
                shownCompareItems.push(graphMetadata.find(graph => graph.key == btn.id.replace("Shown", "")).label)
            } else {
                shownDashboardItems.push(graphMetadata.find(graph => graph.key == btn.id.replace("Shown", "")).label)
            }
        })
        hidden.forEach(btn => {
            if (grid.id.includes("Compare")) {
                hiddenCompareItems.push(graphMetadata.find(graph => graph.key == btn.id.replace("Hidden", "")).label)
            } else {
                hiddenDashboardItems.push(graphMetadata.find(graph => graph.key == btn.id.replace("Hidden", "")).label)
            }
        })
        if (shownDashboardItems.length + hiddenDashboardItems.length > 0) {
            set_local_storage_item("view.dashboard.graphs.show", shownDashboardItems)
            set_local_storage_item("view.dashboard.graphs.hide", hiddenDashboardItems)
        }
        if (shownCompareItems.length + hiddenCompareItems.length > 0) {
            set_local_storage_item("view.compare.graphs.show", shownCompareItems)
            set_local_storage_item("view.compare.graphs.hide", hiddenCompareItems)
        }
    });
    // save table section layout
    const shownTables = [...document.querySelectorAll("#gridTable .shown-graph:not([hidden])")]
        .map(el => {
            const key = el.id.replace("Shown", "");
            return graphMetadata.find(graph => graph.key === key)?.label;
        });

    const hiddenTables = [...document.querySelectorAll("#gridTable .hidden-graph:not([hidden])")]
        .map(el => {
            const key = el.id.replace("Hidden", "");
            return graphMetadata.find(graph => graph.key === key)?.label;
        });
    if (shownTables.length + hiddenTables.length > 0) {
        set_local_storage_item("view.tables.graphs.show", shownTables)
        set_local_storage_item("view.tables.graphs.hide", hiddenTables)
    }
    // save dashboard section layout
    const shownDashboardSections = [...document.querySelectorAll(".shown-section:not([hidden])")]
        .map(el => {
            var key = el.id.replace("SectionShown", "");
            key = String(key).charAt(0).toUpperCase() + String(key).slice(1);
            return `${key} Statistics`
        });
    const hiddenDashboardSections = [...document.querySelectorAll(".hidden-section:not([hidden])")]
        .map(el => {
            var key = el.id.replace("SectionHidden", "");
            key = String(key).charAt(0).toUpperCase() + String(key).slice(1);
            return `${key} Statistics`
        });
    if (shownDashboardSections.length + hiddenDashboardSections.length > 0) {
        set_local_storage_item("view.dashboard.sections.show", shownDashboardSections)
        set_local_storage_item("view.dashboard.sections.hide", hiddenDashboardSections)
    }

    add_alert("Layout has been updated and saved to settings in local storage!", "success")
}

function setup_edit_mode_icons(hidden) {
    document.querySelectorAll(".bar-graph").forEach(btn => btn.hidden = hidden)
    document.querySelectorAll(".line-graph").forEach(btn => btn.hidden = hidden)
    document.querySelectorAll(".timeline-graph").forEach(btn => btn.hidden = hidden)
    document.querySelectorAll(".radar-graph").forEach(btn => btn.hidden = hidden)
    document.querySelectorAll(".pie-graph").forEach(btn => btn.hidden = hidden)
    document.querySelectorAll(".percentage-graph").forEach(btn => btn.hidden = hidden)
    document.querySelectorAll(".stats-graph").forEach(btn => btn.hidden = hidden)
    document.querySelectorAll(".boxplot-graph").forEach(btn => btn.hidden = hidden)
    document.querySelectorAll(".heatmap-graph").forEach(btn => btn.hidden = hidden)
    document.querySelectorAll(".fullscreen-graph").forEach(btn => btn.hidden = hidden)
    if (hidden) {
        document.querySelector('.navbar-nav').classList.add('navbar-disabled');
        document.querySelectorAll('.navbar-disabled').forEach(el => {
            el.classList.add("information")
            el.setAttribute("data-title", "Save your layout changes first! (Save Icon)");
        });
    } else {
        document.querySelectorAll('.navbar-disabled').forEach(el => {
            el.classList.remove("information")
            el.removeAttribute("data-title")
        });
        document.querySelector('.navbar-nav').classList.remove('navbar-disabled');
    }
}

// function to add the layout eventlisteners
function setup_layout() {
    document.addEventListener("graphs-finalized", () => {
        if (gridEditMode) {
            setup_edit_mode_icons(true);
        } else {
            setup_edit_mode_icons(false);
        }
    });
    document.getElementById("customizeLayout").addEventListener("click", (e) => {
        gridEditMode = !gridEditMode;
        customize_layout();
        setup_data_and_graphs();
    });
    document.getElementById("saveLayout").addEventListener("click", (e) => {
        gridEditMode = !gridEditMode;
        save_layout()
        setup_data_and_graphs();
    });
    // disable or enable sections
    document.querySelectorAll(".shown-section").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.hidden = true;
            document.getElementById(`${btn.id.replace("Shown", "Hidden")}`).hidden = false;
        })
    });
    document.querySelectorAll(".hidden-section").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.hidden = true;
            document.getElementById(`${btn.id.replace("Hidden", "Shown")}`).hidden = false;
        })
    });
    // move sections up or down
    document.querySelectorAll(".move-up-section").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".card");
            const previousCard = card.previousElementSibling;
            if (previousCard && !previousCard.hidden && previousCard.classList.contains("card")) {
                card.parentNode.insertBefore(card, previousCard);
            }
        });
    });
    document.querySelectorAll(".move-down-section").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".card");
            const nextCard = card.nextElementSibling;
            if (nextCard && !nextCard.hidden && nextCard.classList.contains("card")) {
                card.parentNode.insertBefore(nextCard, card);
            }
        });
    });
}

export {
    setup_section_order,
    setup_graph_order,
    setup_tables,
    setup_layout,
};