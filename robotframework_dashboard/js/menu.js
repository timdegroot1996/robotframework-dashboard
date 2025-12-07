import { setup_filtered_data_and_filters, update_overview_version_select_list } from "./filter.js";
import { areGroupedProjectsPrepared } from "./variables/globals.js";
import { space_to_camelcase } from "./common.js";
import { set_local_storage_item } from "./localstorage.js";
import { setup_dashboard_graphs } from "./graph_creation/all.js";
import { settings } from "./variables/settings.js";
import { setup_theme } from "./theme.js";
import { setup_graph_view_buttons } from "./eventlisteners.js";
import { setup_section_order, setup_graph_order } from "./layout.js";
import { setup_information_popups } from "./information.js";
import { update_overview_statistics_heading, prepare_overview } from "./graph_creation/overview.js";

// function to update the section (menu) buttons with the correct eventlisteners
// also sets up the automatic highlighting of the section that is most visible in the top
// 20-50% percent of the screen
function setup_section_menu_buttons() {
    const sectionButtons = [
        document.getElementById("runStatisticsSectionNav"),
        document.getElementById("suiteStatisticsSectionNav"),
        document.getElementById("testStatisticsSectionNav"),
        document.getElementById("keywordStatisticsSectionNav"),
    ];
    const sectionMap = {
        runStatisticsSection: sectionButtons[0],
        suiteStatisticsSection: sectionButtons[1],
        testStatisticsSection: sectionButtons[2],
        keywordStatisticsSection: sectionButtons[3],
    };

    if (settings.menu.dashboard && !settings.show.unified) {
        sectionButtons.forEach(btn => btn.hidden = false);
        sectionButtons.forEach(btn => btn.classList.remove('active'));
        settings.view.dashboard.sections.hide.forEach(hiddenSection => sectionMap[`${space_to_camelcase(hiddenSection)}Section`].hidden = true) // hide section menu buttons that should be hidden
    } else {
        sectionButtons.forEach(btn => btn.hidden = true);
    }

    const sections = Object.keys(sectionMap).map(id => document.getElementById(id));
    function update_active_section() {
        const viewportHeight = window.innerHeight;
        const viewportTop = viewportHeight * 0.2;
        const viewportBottom = viewportHeight * 0.5;
        let bestMatch = null;
        let bestMatchAmount = 0;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Calculate overlap in the 20%-50% viewport vertical range
            const top = Math.max(rect.top, viewportTop);
            const bottom = Math.min(rect.bottom, viewportBottom);
            const overlap = bottom - top;
            if (overlap > bestMatchAmount) {
                bestMatch = section;
                bestMatchAmount = overlap;
            }
        });

        // Highlight the matching button
        sectionButtons.forEach(btn => btn.classList.remove("active"));
        if (bestMatch && sectionMap[bestMatch.id]) {
            sectionMap[bestMatch.id].classList.add("active");
        }
    }

    window.addEventListener("scroll", update_active_section);
    // Initial call to set active on load
    update_active_section();

    sectionButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = document.getElementById(btn.id.slice(0, -3));
            if (target) {
                const stickyTop = document.getElementById("navigation");
                const stickyHeight = stickyTop ? stickyTop.offsetHeight : 0;
                const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
                const top = targetTop < 200 ? 0 : targetTop - stickyHeight - 8; // exception for the section at the top, scroll to 0
                window.scrollTo({
                    top: top - 7,
                    behavior: "auto"
                });
            }
        });
    });
}

function get_most_visible_section() {
    const SECTION_IDS = [
        "overviewStatisticsSection",
        "runStatisticsSection",
        "suiteStatisticsSection",
        "testStatisticsSection",
        "keywordStatisticsSection",
        "compareStatisticsSection",
        "runTableCanvas",
        "suiteTableCanvas",
        "testTableCanvas",
        "keywordTableCanvas"
    ];
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;
    const focusTop = viewportTop + window.innerHeight * 0.2;
    const focusBottom = viewportTop + window.innerHeight * 0.5;

    let bestMatchId = null;
    let maxVisibleArea = 0;

    SECTION_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el || el.offsetParent === null) return; // skip hidden elements

        const rect = el.getBoundingClientRect();
        const elTop = rect.top + window.scrollY;
        const elBottom = elTop + rect.height;

        const visibleTop = Math.max(elTop, focusTop);
        const visibleBottom = Math.min(elBottom, focusBottom);

        const visibleHeight = visibleBottom - visibleTop;
        if (visibleHeight > maxVisibleArea) {
            maxVisibleArea = visibleHeight;
            bestMatchId = id;
        }
    });
    return bestMatchId;
}

function update_menu(item) {
    ["overview", "dashboard", "compare", "tables"].forEach(menuItem => {
        set_local_storage_item(`menu.${menuItem}`, (item === `menu${menuItem.charAt(0).toUpperCase() + menuItem.slice(1)}`));
    });
    ["menuOverview", "menuDashboard", "menuCompare", "menuTables"].forEach(id => {
        document.getElementById(id).classList.toggle("active", id === item);
        document.getElementById("customizeLayout").hidden = item == "menuOverview";
        document.getElementById("projectOverview").hidden = item !== "menuOverview";
    });
    setup_data_and_graphs(true, item === "menuOverview" && !areGroupedProjectsPrepared);
}

// function to setup the menu eventlisteners
function setup_menu() {
    document.getElementById("menuOverview").addEventListener("click", () => update_menu("menuOverview"));
    document.getElementById("menuDashboard").addEventListener("click", () => update_menu("menuDashboard"));
    document.getElementById("menuCompare").addEventListener("click", () => update_menu("menuCompare"));
    document.getElementById("menuTables").addEventListener("click", () => update_menu("menuTables"));

    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");
    let selectedMenu;

    if (pageParam) {
        switch (pageParam.toLowerCase()) {
            case "overview":
                selectedMenu = "menuOverview";
                break;
            case "dashboard":
                selectedMenu = "menuDashboard";
                break;
            case "compare":
                selectedMenu = "menuCompare";
                break;
            case "tables":
                selectedMenu = "menuTables";
                break;
        }
        if (selectedMenu) {
            settings.menu = {
                overview: selectedMenu === "menuOverview",
                dashboard: selectedMenu === "menuDashboard",
                compare: selectedMenu === "menuCompare",
                tables: selectedMenu === "menuTables",
            };
        }
    }

    // Priority 2: fall back to settings if no valid URL param
    if (!selectedMenu) {
        const menuSettings = settings.menu;
        if (menuSettings.overview) selectedMenu = "menuOverview";
        else if (menuSettings.dashboard) selectedMenu = "menuDashboard";
        else if (menuSettings.compare) selectedMenu = "menuCompare";
        else if (menuSettings.tables) selectedMenu = "menuTables";
    }
    update_menu(selectedMenu);
}

// function to update all graph data, function is called when updating filters and when the page loads
function setup_data_and_graphs(menuUpdate = false, prepareOverviewProjectData = false) {
    setup_spinner(false); // show spinner immediately
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (prepareOverviewProjectData) {
                prepare_overview();
                update_overview_version_select_list();
                update_overview_statistics_heading();
            }
            setup_filtered_data_and_filters();
            setup_section_order();
            setup_graph_order();
            setup_information_popups();
            setup_graph_view_buttons();
            setup_theme();

            // let the page sections and events be setup before removing the spinner
            // then load the graphs
            requestAnimationFrame(() => {
                setup_spinner(true);
                setup_section_menu_buttons(); // sections have to be visible to update highlighting correctly
                setup_dashboard_graphs();

                document.dispatchEvent(new Event("graphs-finalized"));

                if (!menuUpdate) {
                    setTimeout(() => {
                        const mostVisibleSectionId = get_most_visible_section();
                        if (mostVisibleSectionId) {
                            const offsetTop = document.getElementById(mostVisibleSectionId).getBoundingClientRect().top;
                            window.scrollTo({
                                top: offsetTop - 67,
                                behavior: "auto"
                            });
                        }
                    }, 100);
                }
            });
        });
    });
}

// function to add a spinner for slow loads
function setup_spinner(hide) {
    if (hide) {
        // Instant transition - hide spinner and show all content immediately
        $("#loading").fadeOut(200);
        $("#overview").fadeIn(200);
        $("#projectOverview").fadeIn(200);
        $("#unified").fadeIn(200);
        $("#dashboard").fadeIn(200);
        $("#compare").fadeIn(200);
        $("#tables").fadeIn(200);
    } else {
        $("#overview").hide()
        $("#projectOverview").hide()
        $("#unified").hide()
        $("#dashboard").hide()
        $("#compare").hide()
        $("#tables").hide()
        $("#loading").show();
    }
}

export {
    setup_menu,
    setup_data_and_graphs,
    setup_spinner,
    update_menu
};