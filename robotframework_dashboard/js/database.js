import { settings } from './constants/settings.js';
import { runs, suites, tests, keywords } from './constants/data.js';

// set default values
function setup_database_stats() {
    document.getElementById("stats").innerHTML = `<table class='table table-striped'>
                <tr><td>Runs</td><td>${runs.length}</td></tr>
                <tr><td>Suites</td><td>${suites.length}</td></tr>
                <tr><td>Tests</td><td>${tests.length}</td></tr>
                <tr><td>Keywords</td><td>${keywords.length}</td></tr>
            </table>`

    window.onbeforeprint = () => {
        return new Promise(res => setTimeout(res, settings.show.duration + 500)); // allow rendering time
    };
}

export { setup_database_stats};