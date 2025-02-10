// JS const
export const maxPoints = 2400;
export const ranks = [
    {
        name: 'Bronze',
        basePoints: 25,
        increment: 25,
        maxPoints: 150,
    },
    {
        name: 'Silver',
        basePoints: 150,
        increment: 50,
        maxPoints: 375,
    },
    {
        name: 'Gold',
        basePoints: 375,
        increment: 75,
        maxPoints: 700,
    },
    {
        name: 'Platinum',
        basePoints: 700,
        increment: 100,
        maxPoints: 1150,
    },
    {
        name: 'Diamond',
        basePoints: 1150,
        increment: 150,
        maxPoints: 1800,
    },
    {
        name: 'Emerald',
        basePoints: 1800,
        increment: 200,
        maxPoints: maxPoints,
    },
];
export const currentSeason = 5;
export const supportedSeasons = [4 ,5];
export const seasonStartDate = {
    4: new Date('2024-09-23T00:00:00Z'),
    5: new Date('2024-12-12T00:00:00Z')
};
export const seasonEndDate = {
    4: new Date('2024-12-11T23:59:59Z'),
    5: new Date('2025-03-19T23:59:59Z'),
}
export const sessionThresholdMS = 120 * 60 * 1000;
export const maxDeviation = 500;

//Elements
export const sidebarElement = document.getElementById('historySidebar');
export const historyLogElement = document.getElementById('historyLog');
export const pointsInputElement = document.getElementById('pointsInput');
export const rankAndTierElement = document.getElementById('rankAndTier');
export const nextTierNameElement = document.getElementById('nextTierName');
export const nextTierPointsElement = document.getElementById('nextTierPoints');
export const nextRankNameElement = document.getElementById('nextRankName');
export const nextRankPointsElement = document.getElementById('nextRankPoints');
export const emeraldPointsElement = document.getElementById('emeraldPoints');
export const tierSecondRoundElement = document.getElementById('tierSecondRound');
export const tierFinalRoundElement = document.getElementById('tierFinalRound');
export const tierFinalVictoryElement = document.getElementById('tierFinalVictory');
export const secondRoundElement = document.getElementById('secondRound');
export const finalRoundElement = document.getElementById('finalRound');
export const finalVictoryElement = document.getElementById('finalVictory');
export const emeraldSecondRoundElement = document.getElementById('emeraldSecondRound');
export const emeraldFinalRoundElement = document.getElementById('emeraldFinalRound');
export const emeraldFinalVictoryElement = document.getElementById('emeraldFinalVictory');
export const dailyGainGoalElement = document.getElementById('dailyGainGoal');
export const todayGainElement = document.getElementById('todayGain');
export const expectedPointsElement = document.getElementById('expectedPoints');
export const rankColumnElement = document.getElementById('rankColumn');

// Buttons
export const secondRoundAddButtonElement = document.getElementById('secondRoundAddButton');
export const finalRoundAddButtonElement = document.getElementById('finalRoundAddButton');
export const finalWinAddButtonElement = document.getElementById('finalWinAddButton');
export const sessionChartButtonElement = document.getElementById('sessionChartButton');
export const dayChartButtonElement = document.getElementById('dayChartButton');
export const weekChartButtonElement = document.getElementById('weekChartButton');
export const monthChartButtonElement = document.getElementById('monthChartButton');
export const seasonChartButtonElement = document.getElementById('seasonChartButton');

// Checkboxes
export const ranksCheckboxElement = document.getElementById('ranksCheckbox');
export const targetCheckboxElement = document.getElementById('targetCheckbox');

//Charts
export const ratingChartElement = document.getElementById('ratingChart')

// Chart config options
export const ChartConfigOption = Object.freeze({
    RANKS: "ranks",
    TARGET: "target"
});

//Checkboxes
export const checkboxes = {
    checkBoxDaily: 'dailyGainColumn',
    checkBoxTier: 'tierColumn',
    checkBoxRank: 'rankColumn',
    checkBoxEm: 'emeraldColumn'
};
export const displayCheckboxes = {
    checkBoxRanks: ChartConfigOption.RANKS,
    checkBoxTarget: ChartConfigOption.TARGET
}