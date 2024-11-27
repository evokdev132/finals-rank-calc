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
        maxPoints: 2400,
    },
];

//Elements
export const sidebarElement = document.getElementById('historySidebar');
export const toggleSidebarBtnElement = document.getElementById('toggleSidebar');
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

// Buttons
export const secondRoundAddButtonElement = document.getElementById('secondRoundAddButton');
export const finalRoundAddButtonElement = document.getElementById('finalRoundAddButton');
export const finalWinAddButtonElement = document.getElementById('finalWinAddButton');

//Charts
export const weeklyRatingChartElement = document.getElementById('weeklyRatingChart')
