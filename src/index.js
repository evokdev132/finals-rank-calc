import {
    toggleSidebarBtnElement,
    sidebarElement,
    pointsInputElement,
    secondRoundAddButtonElement,
    finalRoundAddButtonElement,
    finalWinAddButtonElement
} from "./consts.js";
import {loadHistory} from "./history.js";
import {addPoints, renderCalculations, setPoints} from "./logic.js";
import {createWeeklyRatingChart} from "./graph.js";

export function initializeDom() {
    window.onload = function () {
        const savedSidebarState = localStorage.getItem('sidebarState');
        if (savedSidebarState === 'hidden') {
            sidebarElement.classList.add('hidden');
        } else {
            sidebarElement.classList.remove('hidden');
        }
        loadHistory();

        const savedPoints = localStorage.getItem('rankPoints');
        if (savedPoints) {
            pointsInputElement.value = savedPoints;
            renderCalculations();
        }

        // createRatingChart();
        createWeeklyRatingChart();
    };

    pointsInputElement.addEventListener('input', (data) => {
        setPoints(data);
    })

    toggleSidebarBtnElement.addEventListener('click', () => {
        const isHidden = sidebarElement.classList.toggle('hidden');
        localStorage.setItem('sidebarState', isHidden ? 'hidden' : 'visible');
    });

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