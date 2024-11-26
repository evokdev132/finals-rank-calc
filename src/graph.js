import {ratingChartElement, weeklyRatingChartElement} from "./consts.js";

export let ratingChart;
export let weeklyRatingChart;

export function createRatingChart() {
    const ctx = ratingChartElement.getContext('2d');
    ratingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // X-axis labels, updated dynamically
            datasets: [{
                label: 'Rating Changes',
                data: [], // Y-axis data, updated dynamically
                borderColor: '#f1f2f4',
                backgroundColor: 'rgba(241, 242, 244, 0.2)',
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
                        text: 'Recent Changes',
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
    updateChart();
}

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

export function updateChart() {
    const history = JSON.parse(localStorage.getItem('historyLog')) || [];
    const recentHistory = history.slice(0, 30).reverse();

    const labels = recentHistory.map(entry => {
        const [date, time] = entry.split(' ');
        return `${date} ${time}`;
    });

    const data = recentHistory.reduce((acc, entry) => {
        const change = parseInt(entry.match(/\+(\d+)$/)?.[1] || 0);
        const lastValue = acc.length > 0 ? acc[acc.length - 1] : parseInt(pointsInput.value || 0);
        acc.push(lastValue - change);
        return acc;
    }, []).reverse();

    if (ratingChart) {
        ratingChart.data.labels = labels;
        ratingChart.data.datasets[0].data = data;
        ratingChart.update();
    }
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

    const labels = [];
    const data = [];
    let cumulativeRating = parseInt(pointsInput.value || 0);

    for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(today.getDate() - i);

        const dayLabel = day.toLocaleDateString('en-GB');
        labels.push(dayLabel);

        cumulativeRating -= dailyChanges[dayLabel] || 0;
        data.push(cumulativeRating);
    }

    if (weeklyRatingChart) {
        weeklyRatingChart.data.labels = labels;
        weeklyRatingChart.data.datasets[0].data = data;
        weeklyRatingChart.update();
    }
}