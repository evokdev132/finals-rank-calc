import {
    pointsInputElement,
    secondRoundAddButtonElement,
    finalRoundAddButtonElement,
    finalWinAddButtonElement
} from "./consts.js";
import {loadHistory} from "./history.js";
import {addPoints, renderCalculations, setPoints} from "./logic.js";
import {createWeeklyRatingChart} from "./graph.js";
import {LocalStorageService} from "./localStorage.service.js";
import {DataService} from "./data.service.js";

export function initializeDom() {
    window.onload = function () {
        const savedPoints = LocalStorageService.getCurrentPoints();
        if (savedPoints) {
            pointsInputElement.value = savedPoints;
            renderCalculations();
        }

        DataService.initHistory();
        loadHistory();

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