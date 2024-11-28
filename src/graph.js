import {weeklyRatingChartElement} from "./consts.js";
import {DataService} from "./data.service.js";
import {formatToDate} from "./date.util.js";

export let weeklyRatingChart;

export function createWeeklyRatingChart() {
    const ctx = weeklyRatingChartElement.getContext('2d');
    weeklyRatingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Points',
                data: [],
                borderColor: '#FFCC00',
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
                        text: 'Last 7 Days',
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
    updateWeeklyChart()
}

export function updateWeeklyChart() {
    const chartData = compileWeeklyData()
    if (weeklyRatingChart) {
        weeklyRatingChart.data.labels = chartData.labels;
        weeklyRatingChart.data.datasets[0].data = chartData.data;
        weeklyRatingChart.update();
    }
}

function compileWeeklyData() {
    const history = DataService.retrieveHistory();
    const datePoints = [];
    const chartData = {
        labels: [],
        data: []
    };
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    for (let i = 7; i > 0; i--) {
        const newDate = new Date(todayDate);
        newDate.setDate(todayDate.getDate() - i + 1);
        datePoints.push(newDate);
    }
    const pointsGain = compilePointsGain(datePoints, history);
    chartData.labels = datePoints.map(point => formatToDate(point));
    chartData.data = datePoints.map(label => pointsGain[new Date(label)])
    return chartData;
}

function compilePointsGain(datePoints, history) {
    let dateIndex = datePoints.length - 1;
    let historyIndex = history.length - 1;
    let currentDate = datePoints[dateIndex];
    const pointsGain = {[currentDate]: history[historyIndex].currentPoints}

    while (currentDate >= datePoints[0]) {
        if (new Date(history[historyIndex].date) > currentDate && historyIndex > 0) {
            historyIndex--;
        } else {
            pointsGain[datePoints[--dateIndex]] = history[historyIndex].currentPoints;
            currentDate = datePoints[dateIndex];
        }
    }
    return pointsGain;
}