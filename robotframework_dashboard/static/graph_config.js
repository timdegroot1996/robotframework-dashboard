function get_graph_config(graphType, graphData, graphTitle, xTitle, yTitle, dataSets = true) {
    if (dataSets && graphType == "line") {
        graphData = { datasets: graphData };
    }
    if (graphType == "line") {
        return {
            type: "line",
            data: graphData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        text: graphTitle,
                        display: true,
                    },
                    datalabels: {
                        display: false,
                    },
                    legend: {
                        display: true,
                    },
                },
                scales: {
                    x: {
                        type: "time",
                        time: {
                            tooltipFormat: "dd.MM.yyyy - HH:mm:ss.SSS",
                        },
                        title: {
                            display: true,
                            text: xTitle,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: yTitle,
                        },
                        grace: "5%",
                    },
                },
            },
        };
    } else if (graphType == "bar") {
        return {
            type: "bar",
            data: graphData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: xTitle,
                        },
                        ticks: {
                            minRotation: 20,
                        },
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: yTitle,
                        },
                        grace: "5%",
                    },
                },
                interaction: {
                    mode: "x",
                },
                plugins: {
                    title: {
                        display: true,
                        text: graphTitle,
                    },
                    tooltip: {
                        filter: (tooltipItem) => tooltipItem.dataset.data[tooltipItem.dataIndex] > 0,
                    },
                    datalabels: {
                        color: "#000000",
                        align: "center",
                        anchor: "center",
                        formatter: function (value) {
                            if (value > 0) {
                                return value;
                            } else {
                                value = "";
                                return value;
                            }
                        },
                    },
                },
            },
        };
    } else if (graphType == "timeline") {
        config = {
            type: "bar",
            data: graphData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: "y",
                scales: {
                    y: {
                        stacked: true,
                    },
                },
                plugins: {
                    title: {
                        text: graphTitle,
                        display: true,
                    },
                    legend: {
                        display: false,
                    },
                    datalabels: {
                        display: false,
                    },
                },
            },
        };
        return config;
    }
}
