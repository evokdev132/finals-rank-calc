import {historyLogElement} from "./consts.js";
import {DataService} from "./data.service.js";
import {formatToDateTime} from "./date.util.js";

export function loadHistory(deleteCallback) {
    const history = DataService.retrieveHistory();
    historyLogElement.replaceChildren();
    history.reverse().forEach((entry, index) => {
        const trueIndex = history.length - (index + 1);
        const historyEntry = document.createElement('div');
        historyEntry.className = 'history-entry';
        historyEntry.appendChild(recordText(entry));
        historyEntry.appendChild(recordButton(trueIndex, deleteCallback));
        historyLogElement.appendChild(historyEntry);
    });
}

export function setPoints() {
    const points = LocalStorageService.getCurrentPoints();
    if (points) {
        pointsInputElement.value = savedPoints;
        renderCalculations();
    }
}

function recordButton(index, deleteCallback) {
    const button = document.createElement('button');
    button.className = 'btn-cancel';
    button.textContent = 'x';
    button.addEventListener('click', () => {
        deleteCallback(index);
    });
    return button;
}

function recordText(entry) {
    const text = document.createElement('span');
    text.textContent = formatHistoryEntry(entry);
    return text;
}

function formatHistoryEntry(entry) {
    return `${formatToDateTime(entry.date)}  +${entry.gain}`;
}

export function getTodayHistory() {
    const history = DataService.retrieveHistory();
    const today = new Date().toISOString().split("T")[0];
    const result = [];

    for (let i = history.length - 1; i >= 0; i--) {
        if (!history[i].date.startsWith(today)) break;
        result.unshift(history[i]);
    }
    return result;
}