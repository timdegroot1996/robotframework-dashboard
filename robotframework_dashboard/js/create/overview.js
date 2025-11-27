import { get_graph_config } from '../data/graph_config.js';
import { compare_to_average, transform_file_path } from '../common.js';
import { update_menu } from '../menu.js';
import { setup_collapsables } from '../eventlisteners.js';
import { clockDarkSVG, clockLightSVG, arrowRight } from '../constants/svg.js';
import {
    passedBackgroundColor,
    passedBackgroundBorderColor,
    failedBackgroundColor,
    failedBackgroundBorderColor,
    skippedBackgroundColor,
    skippedBackgroundBorderColor
} from '../constants/config.js';
import { settings } from '../constants/settings.js';
import {
    CARDS_PER_ROW,
    DEFAULT_DURATION_PERCENTAGE,
    projects_by_tag, projects_by_name,
    selectedRunSetting,
    selectedTagSetting
} from '../constants/globals.js';
import { runs, use_logs } from '../constants/data.js';

// function to create overview statistics blocks in the overview section
function create_overview_statistics_graphs() {
    const data = {};
    for (const run of runs) {
        const projects = new Set();
        if (settings.switch.runTags) {
            const projectTags = run.tags.split(",").filter(t => t.startsWith("project_"));
            projectTags?.forEach(tag => projects.add(tag));
        }
        if (settings.switch.runName) {
            projects.add(run.name);
        }

        for (const project of projects) {
            if (!data[project]) {
                data[project] = { runs: [] };
            }
            data[project].runs.push({
                stats: [run.passed, run.failed, run.skipped, run.elapsed_s, run.path],
                duration: run.elapsed_s,
                passed_run: run.failed === 0 ? 1 : 0
            });
        }
    }

    const avg = arr => arr.reduce((a, b) => a + parseFloat(b), 0) / arr.length;

    let overviewHTML = '';
    const overviewDurationPercentage = document.getElementById('overviewDurationPercentage').value;
    const keys = Object.keys(data).sort();
    const svg = document.getElementsByTagName("html")[0].getAttribute("data-bs-theme") == "dark" ? clockDarkSVG : clockLightSVG;
    document.getElementById("overviewTitle").innerHTML = `Overview Statistics <h6>showing ${Object.keys(runs).length} runs in ${keys.length} projects</h6`;

    let cardCounter = 0;
    const idPostfix = "_OverviewStatistics"; // can be a set postfix because it is always unique with the name in this code

    keys.forEach(key => {
        const runList = [...data[key].runs].reverse(); // newest first
        const r = runList[0];
        const [passed, failed, skipped, duration, rawPath] = r.stats;
        const path = transform_file_path(rawPath).replaceAll('\\', '\\\\');
        const runNumber = runList.length;
        const durationsForAvg = runList
            .map(x => x.duration)
            .filter(item => item !== duration);
        const average = durationsForAvg.length ? avg(durationsForAvg) : duration;
        const compares = compare_to_average(duration, average, overviewDurationPercentage);
        const rounded_duration = Math.round(duration);
        const passedRuns = (runList.reduce((a, b) => a + b.passed_run, 0) / runList.length * 100).toFixed(2);
        const status = failed > 0 ? 'failed' : skipped > 0 ? 'skipped' : 'passed';
        const log_path = use_logs ? path : '';
        const log_name = use_logs ? 'log.html' : '';

        if (cardCounter % CARDS_PER_ROW === 0) {
            overviewHTML += '<div class="row">';
        }
        overviewHTML += generate_overview_card_html(
            key,
            r.stats,
            rounded_duration,
            status,
            runNumber,
            compares,
            passedRuns,
            log_path,
            log_name,
            svg,
            idPostfix
        );
        cardCounter++;
        if (cardCounter % CARDS_PER_ROW === 0) {
            overviewHTML += '</div>';
        }
    });

    if (cardCounter % CARDS_PER_ROW !== 0) {
        overviewHTML += '</div>';
    }
    document.getElementById("gridOverview").innerHTML = overviewHTML;
    keys.forEach(key => {
        const runList = data[key].runs.slice().reverse();
        const r = runList[0];
        const cardEl = document.getElementById(`${key}Card${idPostfix}`);
        if (cardEl) {
            // build charts
            create_overview_run_donut(r, "_OverviewStatistics", key);
            // attach click listener
            cardEl.addEventListener("click", () => {
                clear_project_filter();
                set_filter_show_current_project(key);
                update_menu("menuDashboard");
            });
        }
    });
}

function update_donut_charts(scopeElement) {
    const donutContainer = document.getElementById(scopeElement);
    donutContainer.querySelectorAll(".overview-canvas").forEach(canvas => {
        const chart = canvas.querySelector("canvas").chartInstance;
        if (chart) chart.update();
    });
}

function clear_project_filter() {
    document.getElementById("runs").value = "All";
    const tagElements = document.getElementById("runTag").getElementsByTagName("input");
    for (const input of tagElements) {
        input.checked = false;
        if (input.id == "All") input.checked = true;
    }
    return;
}

function set_filter_show_current_project(projectName) {
    if (projectName.startsWith("project_")) {
        selectedTagSetting = projectName;
    } else {
        selectedRunSetting = projectName;
    }
    return;
}

function prepare_projects_grouped_data() {
    for (const run of runs) {
        const tags = run.tags.split(",");
        const project_tags = tags.filter(tag => tag.toLowerCase().startsWith("project_"));
        for (const project of project_tags) {
            if (!projects_by_tag[project]) {
                projects_by_tag[project] = [];
            }
            projects_by_tag[project].push(run);
        }
        if (!projects_by_name[run.name]) {
            projects_by_name[run.name] = [];
        }
        projects_by_name[run.name].push(run);
    }
    areGroupedProjectsPrepared = true;
    create_project_overview();
}

function create_project_overview() {
    const projectOverviewData = document.getElementById("projectOverviewData");
    projectOverviewData.innerHTML = "";
    const projectData = { ...projects_by_name, ...projects_by_tag };
    // create run cards for each project
    Object.keys(projectData).sort().forEach(projectName => {
        create_project_cards_container(projectName, projectData[projectName]);
    });
    // setup collapsables specifically for overview project sections
    setup_collapsables(projectOverviewData);
    // set project bar visibility based on switch settings
    update_projectbar_visibility();
}

// create project bar (the collapsables below overview statistic) in overview
function create_project_bar(projectName, projectRuns, totalRunsAmount, passRate) {
    const projectOverviewData = document.getElementById("projectOverviewData");
    const projectCard = `
            <div class="card mb-3" id="${projectName}Card">
                  <div class="card-header">
                      <div class="row">
                          <div class="col-auto align-self-center">
                              <div class="btn btn-sm collapse-icon" id="collapse${projectName}Body">
                                  ${arrowRight}
                              </div>
                          </div>
                          <div class="col-4">
                              <h4>${projectName}</h4>
                              <h6>Total Runs: ${totalRunsAmount} | Passed Runs: ${passRate}%</h6>
                          </div>
                          <div class="d-flex flex-wrap align-items-start col align-items-center">
                              <div class="col-auto">
                                  <div class="btn-group">
                                      <label class="form-check-label" for="${projectName}DurationPercentage">Percentage</label>
                                  </div>
                                  <div class="btn-group">
                                      <select class="form-select form-select-sm mt-1" id="${projectName}DurationPercentage">
                                        ${[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val =>
        `<option value="${val}" ${val === DEFAULT_DURATION_PERCENTAGE ? 'selected' : ''}>${val}</option>`
    ).join('')}
                                      </select>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="card-body" id="${projectName}Body" hidden="">
                      <div id="${projectName}RunCardsContainer">
                      </div>
                  </div>
              </div>
            `;
    projectOverviewData.appendChild(document.createRange().createContextualFragment(projectCard));
    const projectPercentageSelector = document.getElementById(`${projectName}DurationPercentage`);
    projectPercentageSelector.addEventListener('change', () => {
        const newPercent = parseInt(projectPercentageSelector.value, 10);
        update_duration_comparison_for_project(projectName, projectRuns, newPercent);
    });
}

// holds rows, each containing 3 run cards, for overview project section
function create_project_cards_container(projectName, projectRuns, percent = 20) {
    const totalRunsAmount = projectRuns.length;
    const passedRunsAmount = projectRuns.filter(run => run.failed === 0).length;
    const passRate = ((passedRunsAmount / totalRunsAmount) * 100).toFixed(2);
    const cardsContainer = document.getElementById(`${projectName}RunCardsContainer`);
    const durations = projectRuns.map(r => r.elapsed_s);
    // create section for project in overview if not present
    if (!cardsContainer) create_project_bar(projectName, projectRuns, totalRunsAmount, passRate);
    const container = document.getElementById(`${projectName}RunCardsContainer`);
    container.innerHTML = '';
    const projectRunsToShow = projectRuns.slice().reverse();
    // create cards and charts for each run card
    let cardCounter = 0;
    let currentRow;
    projectRunsToShow.forEach((run, idx) => {
        const runNumber = projectRunsToShow.length - idx;
        const createdRunCardId = create_project_run_card(run, projectName, idx, runNumber, passRate, percent, durations)
        const createdRunCard = document.getElementById(createdRunCardId);
        // group 3 cards into row
        if (cardCounter % CARDS_PER_ROW === 0) {
            currentRow = document.createElement('div');
            currentRow.className = 'row';
            container.appendChild(currentRow);
        }
        currentRow.appendChild(createdRunCard);
        create_overview_run_donut(run, idx, projectName);
        cardCounter++;
    });
}

// create a run card that will be displayed within each project section in overview
function create_project_run_card(run, projectName, runIndex, runNumber, passRate, percent, durations) {
    const avg = arr => arr.reduce((a, b) => a + parseFloat(b), 0) / arr.length;

    const stats = [run.passed, run.failed, run.skipped, run.elapsed_s, run.path];
    const duration = run.elapsed_s;
    const duration_rounded = Math.round(duration);
    const durationsForAvg = durations.filter(item => item !== duration);
    const average = durationsForAvg.length ? avg(durationsForAvg) : duration;
    const status = run.failed > 0 ? 'failed' : run.skipped > 0 ? 'skipped' : 'passed';
    const logPath = use_logs ? transform_file_path(run.path).replaceAll('\\', '\\\\') : '';
    const logName = use_logs ? 'log.html' : '';
    const isDark = document.documentElement.classList.contains("dark-mode");
    const svg = isDark ? clockDarkSVG : clockLightSVG;
    const compares = compare_to_average(duration, average, percent);

    const projectRunCardHTML = generate_overview_card_html(
        projectName,
        stats,
        duration_rounded,
        status,
        runNumber,
        compares,
        passRate,
        logPath,
        logName,
        svg,
        runIndex,
    )
    const existingRunCard = document.getElementById(`${projectName}Card${runIndex}`);
    if (existingRunCard) {
        // preserves listeners of element
        existingRunCard.replaceWith(document.createRange().createContextualFragment(projectRunCardHTML));
    } else {
        const cardsContainer = document.getElementById(`${projectName}RunCardsContainer`);
        cardsContainer.appendChild(document.createRange().createContextualFragment(projectRunCardHTML));
        const createdRunCard = document.getElementById(`${projectName}Card${runIndex}`);
        createdRunCard.addEventListener("click", () => {
            clear_project_filter();
            set_filter_show_current_project(projectName);
            update_menu("menuDashboard");
        });
    }
    return `${projectName}Card${runIndex}`;
}

function create_overview_run_donut(run, chartElementPostfix, projectName) {
    let passed, failed, skipped;
    const idGraphSubString = "Graph";
    // when called for overview statistics
    if (run.stats) {
        [passed, failed, skipped] = run.stats;
    }
    // when called for projects section in overview
    else {
        passed = run.passed;
        failed = run.failed;
        skipped = run.skipped;
    }
    const el = document.getElementById(`${projectName}${idGraphSubString}${chartElementPostfix}`);
    if (!el) {
        console.warn(
            `No element with ID ${projectName}${idGraphSubString}${chartElementPostfix} found for donut chart creation`
        );
        return;
    }
    if (el.chartInstance) el.chartInstance.destroy();
    const chartData = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: [],
            hoverOffset: 4
        }]
    };
    const pushIf = (label, value, bg, border) => {
        if (value > 0) {
            chartData.labels.push(label);
            chartData.datasets[0].data.push(value);
            chartData.datasets[0].backgroundColor.push(bg);
            chartData.datasets[0].borderColor.push(border);
        }
    };
    pushIf('passed', passed, passedBackgroundColor, passedBackgroundBorderColor);
    pushIf('skipped', skipped, skippedBackgroundColor, skippedBackgroundBorderColor);
    pushIf('failed', failed, failedBackgroundColor, failedBackgroundBorderColor);
    const config = get_graph_config('donut', chartData, 'Run Status');
    delete config.options.plugins.datalabels;
    config.options.plugins.legend.display = false;
    el.chartInstance = new Chart(el, config);
}

// hide project bars based on switch config
function update_projectbar_visibility() {
    const container = document.getElementById("projectOverviewData");
    if (!container) return;
    const bars = container.querySelectorAll('[id$="Card"]');
    const tagged = [];
    const untagged = [];
    for (const el of bars) {
        (el.id.startsWith("project_") ? tagged : untagged).push(el);
    }
    const toggleVisibility = (elements, visible) => {
        for (const el of elements) el.hidden = !visible;
    };
    toggleVisibility(tagged, settings.switch.runTags);
    toggleVisibility(untagged, settings.switch.runName);
}

// prevents regeneration of run cards, just changes class for duration highlight
function update_duration_comparison_for_project(projectName, projectRuns, percentage) {
    for (let i = 0; i < projectRuns.length; i++) {
        const comparesElement = document.getElementById(`${projectName}RunCardCompares${i}`);
        const duration = document.getElementById(`${projectName}RunCardComparesValue${i}`).getAttribute("value");
        const durationsForAvg = projectRuns
            .map(r => parseFloat(r.elapsed_s))
            .reverse()
            .filter((_, idx) => idx !== i)
        const averageDuration = durationsForAvg.reduce((a, b) => a + parseFloat(b), 0) / durationsForAvg.length;
        comparesElement.className = compare_to_average(duration, averageDuration, percentage);
    }
}

function generate_overview_card_html(projectName, stats, rounded_duration, status, runNumber, compares, passed_runs, log_path, log_name, svg, idPostfix) {
    return `
    <div class="col-4 overview-card" id="${projectName}Card${idPostfix}">
        <div class="card border-3 border-${status}">
            <div class="card-body">
                <div class="row">
                    <div class="col text-center"><h5 class="card-title mb-0">${projectName}</h5></div>
                    <div class="col-auto"><h5>#${runNumber}</h5></div>
                </div>
                <div class="row">
                    <div class="col-4 overview-canvas">
                        <canvas id="${projectName}Graph${idPostfix}"></canvas>
                    </div>
                    <div class="col-3 d-flex align-items-center">
                        <div>
                            <div class="green-text">Passed: ${stats[0]}</div>
                            <div class="red-text">Failed: ${stats[1]}</div>
                            <div class="yellow-text">Skipped: ${stats[2]}</div>
                        </div>
                    </div>
                    <div class="col-5 d-flex align-items-center" style="overflow:auto;">
                        <div>
                            <div class="${compares}" id="${projectName}RunCardCompares${idPostfix}">
                                <span class="clock-icon">
                                    ${svg}
                                </span>
                                <i id="${projectName}RunCardComparesValue${idPostfix}" value="${rounded_duration}">
                                    ${rounded_duration}s
                                </i>
                            </div>
                            <div>Passed Runs: ${passed_runs}%</div>
                            <a href="#" onclick="event.stopPropagation(); open_log_from_path('${log_path}'); return false;" target="_blank">${log_name}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}


export {
    create_overview_statistics_graphs,
    prepare_projects_grouped_data,
    create_project_overview,
    update_projectbar_visibility,
    update_donut_charts,
    clear_project_filter
};