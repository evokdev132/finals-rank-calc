import {
    nextTierNameElement,
    nextTierPointsElement,
    rankAndTierElement,
    nextRankNameElement,
    nextRankPointsElement,
    emeraldPointsElement,
    tierSecondRoundElement,
    tierFinalRoundElement,
    tierFinalVictoryElement,
    secondRoundElement,
    finalRoundElement,
    finalVictoryElement,
    emeraldSecondRoundElement,
    emeraldFinalRoundElement,
    emeraldFinalVictoryElement,
    ranks,
    pointsInputElement
} from "./consts.js";
import {GraphClass} from "./graph.js";
import {LocalStorageService} from "./localStorage.service.js";
import {DataService} from "./data.service.js";
import {loadHistory} from "./history.js";

export function renderCalculations() {
    const points = LocalStorageService.getCurrentPoints();

    const {
        rank,
        tier,
        pointsToNextTier,
        nextTierName,
        pointsToNextRank,
        nextRankName,
        pointsToEmerald
    } = getRankData(points);

    rankAndTierElement.innerText = `Rank: ${rank} | Tier: ${tier}`;


    nextTierNameElement.innerText = `(${nextTierName})`;
    nextTierPointsElement.innerText = pointsToNextTier !== 'N/A' ? `${points + pointsToNextTier} points` : 'N/A';

    nextRankNameElement.innerText = `(${nextRankName})`;
    nextRankPointsElement.innerText = pointsToNextRank !== 'N/A' ? `${points + pointsToNextRank} points` : 'N/A';

    emeraldPointsElement.innerText = `2400 points`;


    tierSecondRoundElement.innerText = `Second Round: ${Math.ceil(pointsToNextTier / 6)} times`;
    tierFinalRoundElement.innerText = `Final Round: ${Math.ceil(pointsToNextTier / 14)} times`;
    tierFinalVictoryElement.innerText = `Final Victory: ${Math.ceil(pointsToNextTier / 25)} times`;


    secondRoundElement.innerText = `Second Round: ${Math.ceil(pointsToNextRank / 6)} times`;
    finalRoundElement.innerText = `Final Round: ${Math.ceil(pointsToNextRank / 14)} times`;
    finalVictoryElement.innerText = `Final Victory: ${Math.ceil(pointsToNextRank / 25)} times`;


    emeraldSecondRoundElement.innerText = `Second Round: ${Math.ceil(pointsToEmerald / 6)} times`;
    emeraldFinalRoundElement.innerText = `Final Round: ${Math.ceil(pointsToEmerald / 14)} times`;
    emeraldFinalVictoryElement.innerText = `Final Victory: ${Math.ceil(pointsToEmerald / 25)} times`;
}

export function addPoints(points) {
    const currentPoints = parseInt(pointsInputElement.value || 0);
    const newPoints = currentPoints + points;
    pointsInputElement.value = newPoints;
    renderCalculations();
    LocalStorageService.saveCurrentPoints(newPoints);
    DataService.saveToHistory(points, newPoints);
    loadHistory();

    renderCalculations();
    GraphClass.updateChart()
}

export function setPoints(value) {
    const points = Number.parseInt(value);
    LocalStorageService.saveCurrentPoints(points);
    DataService.saveToHistory(0, value);
    renderCalculations();
    GraphClass.updateChart();
}


function getRankData(points) {
    let rankData;
    let nextRankData;
    for (let i = 0; i < ranks.length; i++) {
        if (points >= ranks[i].basePoints && points < ranks[i].maxPoints) {
            rankData = ranks[i];
            nextRankData = ranks[i + 1] || null;
            break;
        }
    }

    if (!rankData) {
        return {
            rank: 'Unranked',
            tier: 'N/A',
            pointsToNextTier: 'N/A',
            nextTierName: 'N/A',
            pointsToNextRank: 'N/A',
            nextRankName: 'N/A',
            pointsToEmerald: 'N/A'
        };
    }


    const {name, basePoints, increment, maxPoints} = rankData;
    const tierNumber = 4 - Math.floor((points - basePoints) / increment);
    const tier = `Tier ${Math.max(1, Math.min(4, tierNumber))}`;


    let nextTierName;
    let nextTierPoints;
    if (tierNumber > 1) {
        nextTierPoints = basePoints + (4 - (tierNumber - 1)) * increment;
        nextTierName = `Tier ${tierNumber - 1}`;
    } else {
        nextTierPoints = nextRankData ? nextRankData.basePoints : 'N/A';
        nextTierName = nextRankData ? `${nextRankData.name} 4` : 'N/A';
    }
    const pointsToNextTier = points < nextTierPoints ? nextTierPoints - points : 'N/A';

    const pointsToNextRank = points < maxPoints ? maxPoints - points : 'N/A';
    const nextRankName = nextRankData ? nextRankData.name : 'N/A';

    const pointsToEmerald = 2400 - points > 0 ? 2400 - points : 'N/A';

    return {rank: name, tier: tier, pointsToNextTier, nextTierName, pointsToNextRank, nextRankName, pointsToEmerald};
}
