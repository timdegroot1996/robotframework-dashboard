import { 
    defaultGraphTypes,
    overviewSections,
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
        dateLabels: true,
        legends: true,
        aliases: false,
        milliseconds: false,
        axisTitles: true,
        animation: true,
        duration: 1500,
        rounding: 6,
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