import { settings } from "../constants/settings.js";

import { create_overview_statistics_graphs 
    
} from "../create/overview.js";
import {
    create_run_statistics_graph,
    create_run_donut_graph,
    create_run_donut_total_graph,
    create_run_stats_graph,
    create_run_duration_graph,
    create_run_heatmap_graph
} from "../create/run.js";
import {
    create_suite_statistics_graph,
    create_suite_folder_donut_graph,
    create_suite_folder_fail_donut_graph,
    create_suite_duration_graph,
    create_suite_most_failed_graph,
    create_suite_most_time_consuming_graph
} from "../create/suite.js";
import {
    create_test_statistics_graph,
    create_test_duration_graph,
    create_test_duration_deviation_graph,
    create_test_messages_graph,
    create_test_most_flaky_graph,
    create_test_recent_most_flaky_graph,
    create_test_most_failed_graph,
    create_test_recent_most_failed_graph,
    create_test_most_time_consuming_graph
} from "../create/test.js";
import {
    create_keyword_statistics_graph,
    create_keyword_times_run_graph,
    create_keyword_total_duration_graph,
    create_keyword_average_duration_graph,
    create_keyword_min_duration_graph,
    create_keyword_max_duration_graph,
    create_keyword_most_failed_graph,
    create_keyword_most_time_consuming_graph,
    create_keyword_most_used_graph
} from "../create/keyword.js";
import {
    create_compare_statistics_graph,
    create_compare_suite_duration_graph,
    create_compare_tests_graph
} from "../create/compare.js";
import {
    create_run_table,
    create_suite_table,
    create_test_table,
    create_keyword_table
} from "../create/tables.js";


// function that updates all graphs based on the new filtered data and hidden choices
function setup_dashboard_graphs() {
    if (settings.menu.overview) {
        create_overview_statistics_graphs();
        update_donut_charts("projectOverviewData");
    } else if (settings.menu.dashboard) {
        create_run_statistics_graph();
        create_run_donut_graph();
        create_run_donut_total_graph();
        create_run_stats_graph();
        create_run_duration_graph();
        create_run_heatmap_graph();
        create_suite_statistics_graph();
        create_suite_folder_donut_graph();
        create_suite_folder_fail_donut_graph();
        create_suite_duration_graph();
        create_suite_most_failed_graph();
        create_suite_most_time_consuming_graph();
        create_test_statistics_graph();
        create_test_duration_graph();
        create_test_duration_deviation_graph();
        create_test_messages_graph();
        create_test_most_flaky_graph();
        create_test_recent_most_flaky_graph();
        create_test_most_failed_graph();
        create_test_recent_most_failed_graph();
        create_test_most_time_consuming_graph();
        create_keyword_statistics_graph();
        create_keyword_times_run_graph();
        create_keyword_total_duration_graph();
        create_keyword_average_duration_graph();
        create_keyword_min_duration_graph();
        create_keyword_max_duration_graph();
        create_keyword_most_failed_graph();
        create_keyword_most_time_consuming_graph();
        create_keyword_most_used_graph();
    } else if (settings.menu.compare) {
        create_compare_statistics_graph();
        create_compare_suite_duration_graph();
        create_compare_tests_graph();
    } else if (settings.menu.tables) {
        create_run_table();
        create_suite_table();
        create_test_table();
        create_keyword_table();
    }
}

export {
    setup_dashboard_graphs
};