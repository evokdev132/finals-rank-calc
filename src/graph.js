import {ratingChartElement, seasonStartDate, currentSeason} from "./consts.js";
import {DataService} from "./data.service.js";
import {formatToDate} from "./date.util.js";
import {LocalStorageService} from "./localStorage.service.js";

export class GraphClass {
    static ratingChart;
    static CHART_OPTIONS = {
        week: 'Last 7 days',
        month: 'Last month',
        allTime: `Season ${currentSeason}`
    }

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
        switch (chartMode) {
            case GraphClass.CHART_OPTIONS.week:
                datePoints = GraphClass.#getWeeklyPoints()
                break;
            case GraphClass.CHART_OPTIONS.month:
                datePoints = GraphClass.#getMonthlyPoints()
                break;
            case GraphClass.CHART_OPTIONS.allTime:
                datePoints = GraphClass.#getAllTimePoints()
                break;
        }

        const pointsGain = GraphClass.#compilePointsGain(datePoints, history);

        chartData.labels = datePoints.map(point => formatToDate(point));
        chartData.data = datePoints.map(label => pointsGain[new Date(label)]);

        if (GraphClass.ratingChart) {
            GraphClass.ratingChart.data.labels = chartData.labels;
            GraphClass.ratingChart.data.datasets[0].data = chartData.data;
            GraphClass.ratingChart.update();
        }
    }


    static #compilePointsGain(datePoints, history) {
        const pointsGain = {};
        let dateIndex = datePoints.length - 2; //skipping the last part
        let historyIndex = history.length - 1;
        let closestPoints = history[history.length-1].currentPoints;

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

        pointsGain[datePoints[datePoints.length-1]] = history[history.length-1].currentPoints;
        return pointsGain;
    }


    static #getWeeklyPoints() {
        const datePoints = [];
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        for (let i = 6; i > 0; i--) {
            const newDate = new Date(todayDate);
            newDate.setDate(todayDate.getDate() - i);
            datePoints.push(newDate);
        }
        datePoints.push(todayDate);
        return datePoints;
    }

    static #getMonthlyPoints() {
        const datePoints = [];
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        const startOfInterval = new Date(todayDate);
        startOfInterval.setDate(todayDate.getDate() - 29);

        const interval = Math.floor(30 / 6);

        for (let i = 0; i < 6; i++) {
            const newDate = new Date(startOfInterval);
            newDate.setDate(startOfInterval.getDate() + i * interval);
            datePoints.push(newDate);
        }

        datePoints.push(todayDate);

        return datePoints
    }

    static #getAllTimePoints() {
        const datePoints = [];
        const todayDate = new Date();
        const startDate = seasonStartDate[currentSeason];
        todayDate.setHours(0, 0, 0, 0);
        const diffInDays = Math.floor((todayDate - startDate) / (1000 * 60 * 60 * 24));
        const offset = Math.floor(diffInDays / 6);

        for (let i = 0; i < 6; i++) {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + i * offset);
            datePoints.push(newDate);
        }

        datePoints.push(todayDate);
        return datePoints;
    }
}