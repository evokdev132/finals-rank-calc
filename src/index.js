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
    };

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