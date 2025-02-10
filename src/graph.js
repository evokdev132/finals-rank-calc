import {
    maxPoints,
    ratingChartElement,
    seasonStartDate,
    seasonEndDate,
    currentSeason,
    sessionThresholdMS,
    ranks,
    maxDeviation,
    ChartConfigOption,
} from "./consts.js";
import {DataService} from "./data.service.js";
import {formatToDate, formatToDateTime} from "./date.util.js";
import {LocalStorageService} from "./localStorage.service.js";


export class GraphClass {
    static ratingChart;
    static CHART_OPTIONS = {
        session: 'Session',
        day: 'Last 14 hours',
        week: 'Last 7 days',
        month: 'Last month',
        season: `Season ${currentSeason}`
    };
    static CHART_CONFIG;
    static TARGET_LINE_NAME = "Target";

    static CHART_MODE = LocalStorageService.getGraphMode() || GraphClass.CHART_OPTIONS["week"];

    static #loadConfig() {
        GraphClass.CHART_CONFIG = LocalStorageService.getGraphConfig();
    }

    static #saveConfig() {
        LocalStorageService.saveGraphConfig(GraphClass.CHART_CONFIG);
    }

    static createChart() {
        const ctx = ratingChartElement.getContext('2d');
        GraphClass.#loadConfig();
        GraphClass.ratingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Points',
                    data: [],
                    borderColor: '#F7BB2B',
                    backgroundColor: 'rgba(255, 204, 0, 0.2)',
                    tension: 0, // Smooth line
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    annotation: {},
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: GraphClass.CHART_MODE,
                            color: '#f1f2f4',
                        },
                        ticks: {
                            color: '#f1f2f4',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Rating',
                            color: '#f1f2f4',
                        },
                        ticks: {
                            color: '#f1f2f4',
                        },
                    },
                },
            },
        });
        GraphClass.updateChart();
    }

    static setChartMode(mode) {
        LocalStorageService.saveGraphMode(mode);
        GraphClass.CHART_MODE = mode;
        GraphClass.ratingChart.options.scales.x.title.text = mode;
        GraphClass.updateChart(mode);
    }

    static setConfig(config, value) {
        GraphClass.CHART_CONFIG[config] = value;
        GraphClass.#saveConfig();
        GraphClass.updateChart();
    }

    static updateChart(chartMode = GraphClass.CHART_MODE) {
        const chartData = {
            labels: [],
            data: []
        };
        const history = DataService.retrieveHistory();
        let datePoints;
        switch (chartMode) {
            case GraphClass.CHART_OPTIONS.session:
                datePoints = GraphClass.#getSessionPoints(history);
                break;
            case GraphClass.CHART_OPTIONS.day:
                datePoints = GraphClass.#getDailyPoints();
                break;
            case GraphClass.CHART_OPTIONS.week:
                datePoints = GraphClass.#getWeeklyPoints();
                break;
            case GraphClass.CHART_OPTIONS.month:
                datePoints = GraphClass.#getMonthlyPoints();
                break;
            case GraphClass.CHART_OPTIONS.season:
                datePoints = GraphClass.#getSeasonPoints();
                break;
        }

        const pointsGain = GraphClass.#compilePointsGain(datePoints, history);

        chartData.labels = datePoints.map(point => formatToDateTime(point));
        chartData.data = datePoints.map(label => pointsGain[new Date(label)]);        

        if (GraphClass.ratingChart) {
            GraphClass.ratingChart.data.labels = chartData.labels;
            GraphClass.ratingChart.data.datasets[0].data = chartData.data;
            GraphClass.#addAnnotatedLines(datePoints, chartData.data);
            GraphClass.ratingChart.update();
        }
    }

    static calculateDatePoints(fromDate, count) {
        const dates = [];
        const now = new Date();
        const lastPoint = now.getTime();
        const firstPoint = fromDate.getTime();
        const delta = Math.round((lastPoint - firstPoint) / (count - 1));

        for (let i = 0; i < count; ++i) {
            dates.push(new Date(firstPoint + i * delta));
        }
        return dates;
    }

    static #compilePointsGain(datePoints, history) {
        const pointsGain = {};
        let dateIndex = datePoints.length - 2; //skipping the last part
        let historyIndex = history.length - 1;
        let closestPoints = history[history.length - 1].currentPoints;

        while (dateIndex > -1 && historyIndex > -1) {
            if (new Date(history[historyIndex].date) > datePoints[dateIndex]) {
                closestPoints = history[historyIndex].currentPoints;
                historyIndex--;
            } else {
                pointsGain[datePoints[dateIndex]] = closestPoints;
                dateIndex--;
            }
        }

        // edge case for emptied history and some dates to cover
        if (historyIndex === -1 && dateIndex === 0) {
            pointsGain[datePoints[dateIndex]] = closestPoints;
        }

        pointsGain[datePoints[datePoints.length - 1]] = history[history.length - 1].currentPoints;
        return pointsGain;
    }

    static #getDailyPoints() {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        return GraphClass.calculateDatePoints(startDate, 7);
    }

    static #getWeeklyPoints() {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        return GraphClass.calculateDatePoints(startDate, 7);
    }

    static #getMonthlyPoints() {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        return GraphClass.calculateDatePoints(startDate, 7);
    }

    static #getSeasonPoints() {
        const startDate = seasonStartDate[currentSeason];
        return GraphClass.calculateDatePoints(startDate, 7);
    }

    static #getSessionPoints(history) {
        let historyIndex = history.length - 1;
        if (history.length === 0) {
            return [];
        }

        let date;
        let delta;
        let lastDate = new Date();

        if (lastDate - new Date(history[historyIndex].date) > sessionThresholdMS) {
            return GraphClass.#getDailyPoints();
        }

        while (historyIndex > -1) {
            date = new Date(history[historyIndex].date);
            delta = lastDate - date;

            if (delta < sessionThresholdMS) {
                lastDate = date;
            } else {
                break;
            }

            historyIndex--;
        }

        // cover the error
        lastDate.setMinutes(lastDate.getMinutes() - 1);
        return GraphClass.calculateDatePoints(lastDate, 7);
    }

    static #addAnnotatedLines(datePoints, points) {
        let annotations = {};
        if (GraphClass.CHART_CONFIG[ChartConfigOption.RANKS]) {
            annotations = {...annotations, ...GraphClass.#getRankLines(points)};
        }
        if (GraphClass.CHART_CONFIG[ChartConfigOption.TARGET]) {
            annotations = {...annotations, ...GraphClass.#getTargetLine(datePoints, points)};
        }
        GraphClass.ratingChart.options.plugins.annotation = {annotations}
    }

    static #getRankLines(points) {
        const maximum = points[points.length - 1];
        const minimum = points[0] ?? points[points.length - 1];
        const annotations = {};

        // show the lines which are only in-between max/min
        ranks.forEach(rank => {
            if (minimum < rank.basePoints && rank.basePoints < maximum) {
                annotations[rank.name] = GraphClass.#getLine(rank.basePoints, rank.name)
            }
        });

        // then find the next rank and if it exists and within the reach - show it too
        const closestUp = ranks.find(rank => rank.basePoints > maximum && rank.basePoints - maximum < maxDeviation);
        if (closestUp) {
            annotations[closestUp.name] = GraphClass.#getLine(closestUp.basePoints, closestUp.name);
        }
        return annotations;
    }

    static #getTargetLine(datePoints, points) {
        let annotations = {}
        const begin = seasonStartDate[currentSeason].getTime();
        const end = seasonEndDate[currentSeason].getTime();
        const delta = maxPoints / (end - begin);
        const beginPoints = delta * (datePoints[0].getTime() - begin);
        const endPoints = delta * (datePoints[datePoints.length - 1].getTime() - begin);
        annotations[GraphClass.TARGET_LINE_NAME] = GraphClass.#getLeanLine(beginPoints, endPoints, GraphClass.TARGET_LINE_NAME);
        return annotations;
    }

    static #getLine(points, name) {
        return GraphClass.#getLeanLine(points, points, name);
    }

    static #getLeanLine(pointsFrom, pointsTo, name) {
        return {
            type: 'line',
            yMin: pointsFrom,
            yMax: pointsTo,
            label: {
                content: name,
                display: true,
                position: name === GraphClass.TARGET_LINE_NAME ? '80%' : '20%'
            },
            borderColor: GraphClass.#getLineColor(name),
            borderDash: [6, 6],
            borderWidth: 2,
        }
    }

    static #getLineColor(name) {
        switch (name) {
            case 'Bronze':
                return '#906a5c';
            case 'Silver':
                return '#c5c8d0'
            case 'Gold':
                return '#c7a545';
            case 'Platinum':
                return '#b4b8bb'
            case 'Diamond':
                return '#5b9fc3';
            case 'Emerald':
                return '#018641'
        }
    }
}