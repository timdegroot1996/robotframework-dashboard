import { setup_local_storage } from "./localstorage.js";
import { setup_database_stats } from "./database.js";
import { setup_layout } from "./layout.js";
import {
    setup_sections_filters,
    setup_collapsables,
    setup_filter_modal,
    setup_settings_modal,
} from "./eventlisteners.js";
import { setup_menu } from "./menu.js";

// function that triggers all functions that should be executed when the dashboard is loaded first
// in the correct order!
function main() {
    setup_local_storage();
    setup_database_stats();
    setup_layout();
    setup_sections_filters();
    setup_collapsables();
    setup_filter_modal();
    setup_settings_modal();
    setup_menu();
}

Chart.register(ChartDataLabels);
main() // trigger on first load