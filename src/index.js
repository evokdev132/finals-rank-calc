import {
    toggleSidebarBtnElement,
    sidebarElement,
    pointsInputElement,
    secondRoundAddButtonElement,
    finalRoundAddButtonElement, finalWinAddButtonElement
} from "./consts.js";
import {loadHistory} from "./history.js";
import {addPoints, renderCalculations} from "./logic.js";

export function initializeDom() {
    window.onload = function () {
        const sidebarState = localStorage.getItem('sidebarState');
        if (sidebarState === 'visible') {
            sidebarElement.classList.add('visible');
        }
        loadHistory();

        const savedPoints = localStorage.getItem('rankPoints');
        if (savedPoints) {
            pointsInputElement.value = savedPoints;
            renderCalculations();
        }
    };

    toggleSidebarBtnElement.addEventListener('click', () => {
        const isVisible = sidebarElement.classList.toggle('visible');
        localStorage.setItem('sidebarState', isVisible ? 'visible' : 'hidden');
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