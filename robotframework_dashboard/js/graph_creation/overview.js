import { get_graph_config } from '../graph_data/graph_config.js';
import {
    compare_to_average,
    transform_file_path,
    debounce,
} from '../common.js';
import { update_menu } from '../menu.js';
import {
    setup_collapsables,
    setup_filter_checkbox_handler_listeners,
    attach_run_card_version_listener
} from '../eventlisteners.js';
import { clockDarkSVG, clockLightSVG, arrowRight } from '../variables/svg.js';
import {
    passedBackgroundColor,
    passedBackgroundBorderColor,
    failedBackgroundColor,
    failedBackgroundBorderColor,
    skippedBackgroundColor,
    skippedBackgroundBorderColor
} from '../variables/chartconfig.js';
import { settings } from '../variables/settings.js';
import {
    DEFAULT_DURATION_PERCENTAGE,
    projects_by_tag,
    projects_by_name,
    selectedRunSetting,
    selectedTagSetting,
    versionsByProject,
    latestRunByProjectName,
    latestRunByProjectTag,
    areGroupedProjectsPrepared
} from '../variables/globals.js';
import { runs, use_logs } from '../variables/data.js';
import { clear_all_filters, update_filter_active_indicator } from '../filter.js';

// function to create overview statistics blocks in the overview section
function create_overview_statistics_graphs(preFilteredRuns = null) {
    const overviewCardsContainer = document.getElementById("overviewRunCardsContainer");
    overviewCardsContainer.innerHTML = '';
    const allProjects = { ...projects_by_name, ...projects_by_tag };
    const durationsByProject = {};
    for (const [projectName, projectRuns] of Object.entries(allProjects)) {
        const durations = projectRuns.map(r => r.elapsed_s);
        durationsByProject[projectName] = durations;
    }
    const latestRunByProject = {};
    if (!preFilteredRuns) {
        settings.switch.runName && Object.assign(latestRunByProject, latestRunByProjectName);
        settings.switch.runTags && Object.assign(latestRunByProject, latestRunByProjectTag);
    } else { // if called by version filter listener
        Object.assign(latestRunByProject, preFilteredRuns);
    }
    for (const [projectName, latestRun] of Object.entries(latestRunByProject)) {
        const projectRuns = allProjects[projectName];
        const totalRunsAmount = projectRuns.length;
        const passedRunsAmount = projectRuns.filter(run => run.failed === 0).length;
        const passRate = ((passedRunsAmount / totalRunsAmount) * 100).toFixed(2);
        const percent = document.getElementById("overviewDurationPercentage").value;
        const projectRunDurations = projectRuns.map(run => run.elapsed_s);
        create_project_run_card(
            latestRun,
            projectName,
            0, // cardIndex, 0 since only 1 run per project in overview
            totalRunsAmount, //run Number
            passRate,
            percent,
            projectRunDurations,
            true // isForOverviewStats
        );
    }
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
    document.getElementById("runTagCheckBoxesFilter").value = "";
    const tagElements = document.getElementById("runTag").getElementsByTagName("input");
    for (const input of tagElements) {
        input.checked = false;
        input.parentElement.classList.remove("d-none"); //show filtered rows
        if (input.id == "All") input.checked = true;
    }
    update_filter_active_indicator("All", "filterRunTagSelectedIndicator");
}


function set_filter_show_current_project(projectName) {
    if (projectName.startsWith("project_")) {
        selectedTagSetting = projectName;
        setTimeout(() => { // hack to prevent update_menu calls from hinderance
            update_filter_active_indicator("All", "filterRunTagSelectedIndicator");
        }, 500);

    } else {
        selectedRunSetting = projectName;
    }
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
    const projectVersions = new Set(
        Object.keys(versionsByProject[projectName])
            .sort()
            .reverse()
    );
    const versionAmount = projectVersions.size;
    const versionFilterListItemAllHtml = generate_version_filter_list_item_html("All", projectName, "checked", versionAmount, "version");
    const versionFilterListItemsHtml = versionFilterListItemAllHtml +
        [...projectVersions]
            .map(version => {
                const runAmount = versionsByProject[projectName][version];
                return generate_version_filter_list_item_html(version, projectName, "", runAmount, "run");
            })
            .join('');
    const percentageSelectHtml = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(val =>
        `<option value="${val}" ${val === DEFAULT_DURATION_PERCENTAGE ? 'selected' : ''}>${val}</option>`
    ).join('');
    // added here instead of adding to informationMap, since the dynamic IDs don't work with the map
    const projectInformation = `This section shows the runs associated with the project '${projectName}':
                                - Duration color indicates performance relative to the average: green if more than x% faster, red if more than x% slower. You can adjust this threshold using the Percentage toggle. Version filters do not affect this.
                                - Passed runs represent the percentage of runs with zero failures. Version filters do not affect this.
                                - The 'Select Versions' dropdown menu allows filtering the runs of the current project by the desired versions. Click 'All' to quickly deselect all other checkboxes.
                                - The runs can also be filtered to only those whose version contains the text entered in the 'Version Filter...' input, even when a checkbox filter is already applied.
                                - Clicking on the run card applies a filter for that project and switches to dashboard
                                - Clicking on the version element within the run card additionally applies a filter for that version`;
    const projectCard = `
    <div class="card mb-3" id="${projectName}Card">
            <div class="card-header">
                <div class="row">
                    <div class="col-auto align-self-center">
                        <div class="btn btn-sm collapse-icon" id="collapse${projectName}Body">
                            ${arrowRight}
                        </div>
                    </div>
                    <div class="col-3">
                        <h4>${projectName}</h4>
                        <h6>Total Runs: ${totalRunsAmount} | Passed Runs: ${passRate}%</h6>
                    </div>
                    <div class="d-flex flex-wrap align-items-start col align-items-center">
                        <div class="col-auto me-2">
                            <div class="btn-group">
                                <label class="form-check-label" for="${projectName}DurationPercentage">Percentage</label>
                            </div>
                            <div class="btn-group">
                                <select class="form-select form-select-sm" id="${projectName}DurationPercentage">
                                    ${percentageSelectHtml}
                                </select>
                            </div>
                        </div>
                        <div class="col-auto">
                            <div class="btn-group">
                                <div id="${projectName}VersionFilterDropDown" class="dropdown" >
                                    <button class="btn btn-sm btn-outline-dark dropdown-toggle"
                                            type="button" id="${projectName}VersionFilterBtn"
                                            data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                        Select Versions
                                    <span id="${projectName}VersionSelectedIndicator" class="version-selected-dot" style="display:none;"></span>
                                    </button>
                                    <ul class="dropdown-menu p-3" style="max-height: 50vh; overflow-y: auto;">
                                        ${versionFilterListItemsHtml}
                                    </ul>
                                </div>
                            </div>
                            <div class="btn-group">
                                <input type="text" class="form-control form-control-sm" id="${projectName}VersionFilterSearch" placeholder="Version Filter...">
                            </div>
                        </div>
                        <div class="col-auto">
                            <a type="button" class="information information-icon ms-2" id="${projectName}Information" data-title="${projectInformation}"></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body" id="${projectName}Body" hidden="">
                <div id="${projectName}RunCardsContainer" class="project-run-cards-container"></div>
            </div>
        </div>
    `;
    projectOverviewData.appendChild(document.createRange().createContextualFragment(projectCard));
    // percentage selector
    const projectPercentageSelector = document.getElementById(`${projectName}DurationPercentage`);
    projectPercentageSelector.addEventListener('change', () => {
        const newPercent = parseInt(projectPercentageSelector.value, 10);
        update_duration_comparison_for_project(projectName, projectRuns, newPercent);
    });
    // version filters
    const versionFilterDropDownId = `${projectName}VersionFilterDropDown`;
    const versionFilterSearchId = `${projectName}VersionFilterSearch`;
    const versionFilterArgs = {
        cardsContainerId: `${projectName}RunCardsContainer`,
        versionDropDownFilterId: versionFilterDropDownId,
        versionStringFilterId: versionFilterSearchId,
    };
    const projectVersionFilterDropDown = document.getElementById(versionFilterDropDownId);
    const allVersionsCheckBox = document.getElementById(`${projectName}VersionFilterListItemAllInput`);
    const specificVersionSelectedIndicatorId = `${projectName}VersionSelectedIndicator`;
    setup_filter_checkbox_handler_listeners(
        projectVersionFilterDropDown,
        allVersionsCheckBox,
        specificVersionSelectedIndicatorId,
        () => { update_project_version_filter_run_card_visibility(versionFilterArgs) }
    );

    // version filter input
    const projectVersionFilterSearch = document.getElementById(versionFilterSearchId);
    const handle_version_filter_input = () => {
        update_project_version_filter_run_card_visibility(versionFilterArgs);
    }
    const maxDelay = 50;
    const delayScaledByRunAmount = Math.min(totalRunsAmount / 100, maxDelay); // ~0.01ms per run or 50ms max
    projectVersionFilterSearch.addEventListener('input', debounce(handle_version_filter_input, delayScaledByRunAmount));
}

// creates overview project section
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
    projectRunsToShow.forEach((run, idx) => {
        const runNumber = projectRunsToShow.length - idx;
        const createdRunCardId = create_project_run_card(run, projectName, idx, runNumber, passRate, percent, durations, false);
        const createdRunCard = document.getElementById(createdRunCardId);
        container.appendChild(createdRunCard);
        create_overview_run_donut(run, idx, projectName);
    });
}

// create a run card that will be displayed within each project section in overview
function create_project_run_card(run, projectName, runIndex, runNumber, passRate, percent, durations, isForOverview = false) {
    const avg = arr => arr.reduce((a, b) => a + parseFloat(b), 0) / arr.length;
    const stats = [run.passed, run.failed, run.skipped, run.elapsed_s, run.path];
    const duration = run.elapsed_s;
    const duration_rounded = Math.round(duration);
    const durationsForAvg = durations.filter(item => item !== duration);
    const average = durationsForAvg.length ? avg(durationsForAvg) : duration;
    const status = run.failed > 0 ? 'failed' : (run.skipped > 0 && run.passed === 0 ? 'skipped' : 'passed');
    const logPath = use_logs ? transform_file_path(run.path).replaceAll('\\', '\\\\') : '';
    const logName = use_logs ? 'log.html' : '';
    const isDark = document.documentElement.classList.contains("dark-mode");
    const svg = isDark ? clockDarkSVG : clockLightSVG;
    const compares = compare_to_average(duration, average, percent);
    const projectNameForId = isForOverview ? `overview${projectName}` : projectName;

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
        run.project_version,
        isForOverview,
    )
    const existingRunCard = document.getElementById(`${projectNameForId}Card${runIndex}`);
    if (existingRunCard) {
        // preserves listeners of element
        existingRunCard.replaceWith(document.createRange().createContextualFragment(projectRunCardHTML));
    } else {
        const cardsContainerIdPrefix = isForOverview ? "overview" : projectName;
        const cardsContainer = document.getElementById(`${cardsContainerIdPrefix}RunCardsContainer`);
        cardsContainer.appendChild(document.createRange().createContextualFragment(projectRunCardHTML));
        const createdRunCard = document.getElementById(`${projectNameForId}Card${runIndex}`);
        createdRunCard.addEventListener("click", () => {
            clear_all_filters();
            set_filter_show_current_project(projectName);
            update_menu("menuDashboard");
        });
        create_overview_run_donut(run, runIndex, projectNameForId);
        const versionElement = createdRunCard.querySelector('[data-js-target="apply-version-filter"]');
        versionElement && attach_run_card_version_listener(versionElement, projectName, run.project_version ?? "None");
    }
    return `${projectNameForId}Card${runIndex}`;
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

function generate_overview_card_html(
    projectName,
    stats,
    rounded_duration,
    status,
    runNumber,
    compares,
    passed_runs,
    log_path,
    log_name,
    svg,
    idPostfix,
    projectVersion = null,
    isForOverview = false,
) {
    const normalizedProjectVersion = projectVersion ?? "None";
    // ensure overview stats and project bar card ids unique
    const projectNameForElementId = isForOverview ? `overview${projectName}` : projectName;
    // for overview statistics
    let cardTitle = `
            <h5 class="card-title mb-0 fw-semibold">${projectName}</h5>
        `;
    let smallVersionHtml = `
        <div id="${projectName}RunCardVersion${idPostfix}"
        class="run-card-small-version"
        title="Click to filter for project and version"
        data-projectVersion="${normalizedProjectVersion}"
        data-js-target="apply-version-filter">
            <div class="text-muted">Version:</div>
            <div>${normalizedProjectVersion}</div>
        </div>`;
    // for project bars
    const versionsForProject = Object.keys(versionsByProject[projectName]);
    const projectHasVersions = !(versionsForProject.length === 1 && versionsForProject[0] === "None");
    const versionClass = "fw-semibold";
    let versionTitle = '';
    if (projectHasVersions) { // version title
        versionTitle = `
            <div class="mx-auto run-card-version-title"
            title="Click to filter for project and version"
            data-js-target="apply-version-filter">
                <h5 class="card-title mb-0 d-inline text-muted">Version:</h5>
                <h5 class="card-title mb-0 d-inline ${versionClass}">
                    ${normalizedProjectVersion}
                </h5>
            </div>
        `;
    } else { // empty title
        versionTitle = `
            <h5 class="card-title mb-0 ${versionClass}"></h5>
        `;
    }
    if (!isForOverview) {
        cardTitle = versionTitle;
        smallVersionHtml = '';
    }
    return `
    <div class="col-4 overview-card" id="${projectNameForElementId}Card${idPostfix}" data-project-version="${normalizedProjectVersion}">
        <div class="card border-3 border-${status}">
            <div class="card-body">
                <div class="row">
                    <div class="col text-center">
                        ${cardTitle}
                    </div>
                    <div class="col-auto"><h5>#${runNumber}</h5></div>
                </div>
                <div class="row">
                    <div class="col-4 overview-canvas">
                        <canvas id="${projectNameForElementId}Graph${idPostfix}"></canvas>
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
                            <div class="${compares}" id="${projectNameForElementId}RunCardCompares${idPostfix}">
                                <span class="clock-icon">
                                    ${svg}
                                </span>
                                <i id="${projectNameForElementId}RunCardComparesValue${idPostfix}" value="${rounded_duration}">
                                    ${rounded_duration}s
                                </i>
                            </div>
                            <div>Passed Runs: ${passed_runs}%</div>
                            ${smallVersionHtml}
                            <a href="#" onclick="event.stopPropagation(); open_log_from_path('${log_path}'); return false;" target="_blank">${log_name}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// apply version select checkbox and version textinput filter
function update_project_version_filter_run_card_visibility({ cardsContainerId, versionDropDownFilterId, versionStringFilterId }) {
    const cardsContainerElement = document.getElementById(cardsContainerId);
    const scrollOffsetBefore = cardsContainerElement.getBoundingClientRect().top;
    const versionDropDownFilter = document.getElementById(versionDropDownFilterId);
    const dropDownCheckBoxes = versionDropDownFilter.querySelectorAll(".version-checkbox");
    const selectedVersions = Array.from(dropDownCheckBoxes)
        .filter(checkBox => checkBox.checked)
        .map(checkBox => checkBox.value);
    const runCardNodeList = cardsContainerElement.querySelectorAll("div.overview-card");
    const runCardsArray = Array.from(runCardNodeList);
    let dropDownFilteredRunCards = runCardsArray;
    if (!selectedVersions.includes("All")) {
        dropDownFilteredRunCards = runCardsArray.filter(runCard =>
            selectedVersions.includes(runCard.dataset.projectVersion)
        );
    }
    const versionStringFilter = document.getElementById(versionStringFilterId);
    const lowerCaseVersionStringFilterValue = versionStringFilter.value.toLowerCase();
    const fullyFilteredRunCards = dropDownFilteredRunCards.filter(runCard =>
        runCard.dataset.projectVersion.toLowerCase()
            .includes(lowerCaseVersionStringFilterValue)
    );
    runCardsArray.forEach(runCard => {
        runCard.style.display = "none";
    });
    fullyFilteredRunCards.forEach(runCard => {
        runCard.style.display = "";
    })
    const scrollOffsetAfter = cardsContainerElement.getBoundingClientRect().top;
    window.scrollBy(0, scrollOffsetAfter - scrollOffsetBefore);
}

function update_overview_statistics_heading() {
    const overviewCardsContainer = document.getElementById("overviewRunCardsContainer");
    const amountOfProjectsShown = overviewCardsContainer.querySelectorAll(".overview-card").length;
    const pluralPostFix = amountOfProjectsShown !== 1 ? 's' : '';
    const headerContent = `<h6>showing ${amountOfProjectsShown} project${pluralPostFix}</h6>`;
    document.getElementById("overviewTitle").innerHTML = `
            Overview Statistics
            ${headerContent}
        `;
}

function prepare_overview() {
    prepare_projects_grouped_data();
    prepare_projects_version_counts_map({ ...projects_by_name, ...projects_by_tag });
    prepare_latest_run_by_project();
    create_overview_statistics_graphs();
    create_project_overview();
}

// versionByProject = {projectName:{version:amount}}
function prepare_projects_version_counts_map(projects) {
    for (const [project, runs] of Object.entries(projects)) {
        const versionCounts = {};
        for (const run of runs) {
            const projectVersion = run.project_version ?? "None";
            versionCounts[projectVersion] = (versionCounts[projectVersion] || 0) + 1;
        }
        versionsByProject[project] = versionCounts;
    }
}

function prepare_latest_run_by_project() {
    function map_latest_run_by_project(runsByProject) {
        latestRunByProject = Object.entries(runsByProject)
            .map(([projectName, projectRuns]) => {
                return [projectName, projectRuns.at(-1)];
            });
        return Object.fromEntries(latestRunByProject);
    }
    Object.assign(latestRunByProjectName, map_latest_run_by_project(projects_by_name));
    Object.assign(latestRunByProjectTag, map_latest_run_by_project(projects_by_tag));
}

export {
    create_overview_statistics_graphs,
    prepare_projects_grouped_data,
    create_project_overview,
    update_projectbar_visibility,
    update_donut_charts,
    clear_project_filter,
    prepare_overview,
    update_overview_statistics_heading
};
