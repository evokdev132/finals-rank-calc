import {weeklyRatingChartElement} from "./consts.js";
import {getCurrentPoints} from "./localStorage.service.js";

export let weeklyRatingChart;

export function createWeeklyRatingChart() {
    const ctx = weeklyRatingChartElement.getContext('2d');
    weeklyRatingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // X-axis labels, updated dynamically
            datasets: [{
                label: 'Weekly Rating Changes',
                data: [], // Y-axis data, updated dynamically
                borderColor: '#FFCC00',
                stepped: true,
                backgroundColor: 'rgba(255, 204, 0, 0.2)',
                tension: 0.4, // Smooth line
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false, // Hide the legend
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
    const history = JSON.parse(localStorage.getItem('historyLog')) || [];
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const dailyChanges = {};
    history.forEach(entry => {
        const parts = entry.split(' ');
        const date = parts[0];
        const change = parts[2];
        const changeValue = parseInt(change.replace('+', ''), 10);

        const [day, month, year] = date.split('/').map(Number);
        const entryDate = new Date(year, month - 1, day);
        if (entryDate >= sevenDaysAgo) {
            dailyChanges[date] = (dailyChanges[date] || 0) + changeValue;
        }
    });
    const chartData = calculateData(history);
    if (weeklyRatingChart) {
        weeklyRatingChart.data.labels = chartData.labels.reverse();
        weeklyRatingChart.data.datasets[0].data = chartData.data.reverse();
        weeklyRatingChart.update();
    }
}

// gl understanding it
function calculateData(history) {
    const currentDate = new Date();
    const limitDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 8)
    const chartData = {
        labels: getLabels(),
        data: []
    };
    const currentPoints = getCurrentPoints();
    const parsedData = {};

    history.reverse().forEach(entry => {
        const [date, time, points] = entry.split(' ');
        const parsedStringDate = parseGbString(date);
        if (parsedStringDate > limitDate) {
            addEntryToArray(date, Number.parseInt(points), parsedData);
        }
    });
    const compiledChanges = chartData.labels.map(label => {
        if (parsedData[label]) {
            return parsedData[label].reduce((sum, element) => sum + element, 0)
        } else {
            return 0;
        }
    })
    compiledChanges.unshift(0);
    chartData.data = compiledChanges.reduce((result, change, index) => {
        const previousValue = index === 0 ? currentPoints : result[index - 1];
        result.push(previousValue - change);
        return result;
    }, []);
    chartData.data.pop();
    return chartData;
}

function parseGbString(stringDate) {
    const [day, month, year] = stringDate.split('/').map(Number);
    return new Date(year, month - 1, day);
}

function addEntryToArray(key, value, object) {
    if (object[key]) {
        object[key].push(value);
    } else {
        object[key] = [value];
    }
}

function getLabels(interval = 'week') {
    if (interval === 'week') {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - i);

            const day = String(pastDate.getDate()).padStart(2, '0');
            const month = String(pastDate.getMonth() + 1).padStart(2, '0');
            const year = String(pastDate.getFullYear());

            dates.push(`${day}/${month}/${year}`);
        }

        return dates;
    }
    return [];
}