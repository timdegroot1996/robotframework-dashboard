import { setup_theme } from './admin_theme.js';
import { setup_information_popups } from './admin_information.js';
import { get_outputs, get_logs } from './admin_api.js';
import { setup_output_button_eventlisteners } from './admin_eventlisteners.js';

// function that triggers all functions that should be executed when the dashboard is loaded first
// in the correct order!
function main() {
    setup_theme();
    setup_output_button_eventlisteners();
    setup_information_popups();
    get_outputs();
    get_logs();
}

main();