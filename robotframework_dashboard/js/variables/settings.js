import { 
    defaultGraphTypes,
    overviewSections,
    unifiedSections,
    dashboardSections,
    dashboardGraphs,
    compareSections,
    compareGraphs,
    tableSections,
    tableGraphs
} from './graphs.js';

// settings var
var settings = {
    switch: {
        runTags: false,
        runName: true,
        suitePathsSuiteSection: false,
        suitePathsTestSection: false,
        suitePathsCompareSection: false,
        useLibraryNames: false,
    },
    show: {
        unified: false,
        dateLabels: true,
        legends: true,
        aliases: false,
        milliseconds: false,
        axisTitles: true,
        animation: true,
        duration: 1500,
        rounding: 6,
    },
    theme_colors: {
        light: {
            background: '#eee',
            card: '#ffffff',
            menuText: '#000000',
            text: '#000000',
            passed: '#97bd61',
            skipped: '#fed84f',
            failed: '#ce3e01',
        },
        dark: {
            background: '#0f172a',
            card: 'rgba(30, 41, 59, 0.9)',
            menuText: '#ffffff',
            text: '#eee',
            passed: '#97bd61',
            skipped: '#fed84f',
            failed: '#ce3e01',
        }
    },
    menu: {
        overview: false,
        dashboard: true,
        compare: false,
        tables: false,
    },
    graphTypes: defaultGraphTypes,
    view: {
        overview: {
            sections: {
                show: overviewSections,
                hide: [],
            },
            graphs: {
                show: [],
                hide: [],
            }
        },
        unified: {
            sections: {
                show: unifiedSections,
                hide: [],
            },
            graphs: {
                show: dashboardGraphs,
                hide: [],
            }
        },
        dashboard: {
            sections: {
                show: dashboardSections,
                hide: [],
            },
            graphs: {
                show: dashboardGraphs,
                hide: [],
            },
        },
        compare: {
            sections: {
                show: compareSections,
                hide: [],
            },
            graphs: {
                show: compareGraphs,
                hide: [],
            },
        },
        tables: {
            sections: {
                show: tableSections,
                hide: [],
            },
            graphs: {
                show: tableGraphs,
                hide: [],
            },
        },
    }
};

export { 
    settings
};