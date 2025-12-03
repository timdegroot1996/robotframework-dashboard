import { setup_theme } from './theme.js';
import { setup_information_popups } from './information.js';
import { get_admin_json_config, get_outputs } from './api.js';
import {
    setup_output_button_eventlisteners,
    setup_settings_modal
} from './eventlisteners.js';

// function that triggers all functions that should be executed when the dashboard is loaded first
// in the correct order!
function main() {
    setup_theme();
    setup_output_button_eventlisteners();
    setup_information_popups();
    setup_settings_modal();
    get_admin_json_config();
    get_outputs();
}

main();