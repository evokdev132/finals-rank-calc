import {
    maxPoints,
    ratingChartElement,
    seasonStartDate,
    seasonEndDate,
    currentSeason,
    sessionThresholdMS,
    ranks,
    maxDeviation,
} from "./consts.js";
import {DataService} from "./data.service.js";
import {formatToDate, formatToDateTime} from "./date.util.js";
import {LocalStorageService} from "./localStorage.service.js";


class AnnotationConfig {
    approximation;
    ranks;

    constructor(ranks, approximation) {
        this.ranks = ranks;
        this.approximation = approximation;
    }

    static ranksOnly() {
        return new AnnotationConfig(true, false);
    }
}


export class GraphClass {
    static ratingChart;
    static CHART_OPTIONS = {
        session: 'Session',
        day: 'Last 14 hours',
        week: 'Last 7 days',
        month: 'Last month',
        season: `Season ${currentSeason}`
    };
    static APPROX_LINE_NAME = "Target";

    static CHART_MODE = LocalStorageService.getGraphMode() || GraphClass.CHART_OPTIONS["week"];

    static createChart() {
        const ctx = ratingChartElement.getContext('2d');
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

    static updateChart(chartMode = GraphClass.CHART_MODE) {
        const chartData = {
            labels: [],
            data: []
        };
        const history = DataService.retrieveHistory();
        let datePoints;
        let annotationConfig;
        switch (chartMode) {
            case GraphClass.CHART_OPTIONS.session:
                datePoints = GraphClass.#getSessionPoints(history);
                annotationConfig = AnnotationConfig.ranksOnly();
                break;
            case GraphClass.CHART_OPTIONS.day:
                datePoints = GraphClass.#getDailyPoints();
                annotationConfig = AnnotationConfig.ranksOnly();
                break;
            case GraphClass.CHART_OPTIONS.week:
                datePoints = GraphClass.#getWeeklyPoints();
                annotationConfig = AnnotationConfig.ranksOnly();
                break;
            case GraphClass.CHART_OPTIONS.month:
                datePoints = GraphClass.#getMonthlyPoints();
                annotationConfig = AnnotationConfig.ranksOnly();
                break;
            case GraphClass.CHART_OPTIONS.season:
                datePoints = GraphClass.#getSeasonPoints();
                annotationConfig = new AnnotationConfig(true, true);
                break;
        }

        const pointsGain = GraphClass.#compilePointsGain(datePoints, history);

        chartData.labels = datePoints.map(point => formatToDateTime(point));
        chartData.data = datePoints.map(label => pointsGain[new Date(label)]);        

        if (GraphClass.ratingChart) {
            GraphClass.ratingChart.data.labels = chartData.labels;
            GraphClass.ratingChart.data.datasets[0].data = chartData.data;
            GraphClass.#addAnnotatedLines(datePoints, chartData.data, annotationConfig);
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

    static #addAnnotatedLines(datePoints, points, config) {
        let annotations = {};
        if (config.ranks) {
            annotations = {...annotations, ...GraphClass.#getRankLines(points)};
        }
        if (config.approximation) {
            annotations = {...annotations, ...GraphClass.#getApproximationLine(datePoints, points)};
        }
        GraphClass.ratingChart.options.plugins.annotation = {annotations}
    }

    static #getRankLines(points) {
        const maximum = points[points.length - 1] * 1.5;
        const minimum = points[0] ?? points[points.length - 1];
        const annotations = {};

        ranks.forEach(rank => {
            if (minimum < rank.basePoints && rank.basePoints < maximum) {
                annotations[rank.name] = GraphClass.#getLine(rank.basePoints, rank.name)
            }
        });
        if (ranks.length) {
            const closestUp = ranks.find(rank => rank.basePoints > maximum);
            annotations[closestUp.name] = GraphClass.#getLine(closestUp.basePoints, closestUp.name);
        }
        return annotations;
    }

    static #getApproximationLine(datePoints, points) {
        let annotations = {}
        const begin = seasonStartDate[currentSeason].getTime();
        const end = seasonEndDate[currentSeason].getTime();
        const delta = maxPoints / (end - begin);
        const now = new Date().getTime();
        const currentApprox = delta * (now - begin);
        if (Math.abs(currentApprox - points[points.length - 1]) <= maxDeviation) {
            const beginPoints = delta * (datePoints[0].getTime() - begin);
            const endPoints = delta * (datePoints[datePoints.length - 1].getTime() - begin);
            annotations[GraphClass.APPROX_LINE_NAME] = GraphClass.#getLeanLine(beginPoints, endPoints, GraphClass.APPROX_LINE_NAME);
        }
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
                display: true
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