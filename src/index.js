import {
    sidebarElement,
    pointsInputElement,
    secondRoundAddButtonElement,
    finalRoundAddButtonElement,
    finalWinAddButtonElement
} from "./consts.js";
import {loadHistory} from "./history.js";
import {addPoints, renderCalculations, setPoints} from "./logic.js";
import {createWeeklyRatingChart} from "./graph.js";
import {getCurrentPoints} from "./localStorage.service.js";

export function initializeDom() {
    window.onload = function () {
        loadHistory();

        const savedPoints = getCurrentPoints();
        if (savedPoints) {
            pointsInputElement.value = savedPoints;
            renderCalculations();
        }

        createWeeklyRatingChart();
    };

    pointsInputElement.addEventListener('input', (data) => {
        setPoints(data);
    })

    secondRoundAddButtonElement.addEventListener('click', () => {
        addPoints(6);
    })
    finalRoundAddButtonElement.addEventListener('click', () => {
        addPoints(14);
    })
    finalWinAddButtonElement.addEventListener('click', () => {
        addPoints(25);
    })
}

initializeDom();