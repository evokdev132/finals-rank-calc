import {historyLogElement} from "./consts.js";
import {DataService} from "./data.service.js";
import {formatToDateTime} from "./date.util.js";

export function loadHistory() {
    const history = DataService.retrieveHistory();
    historyLogElement.innerHTML = '';
    history.reverse().forEach(entry => {
        const historyEntry = document.createElement('div');
        historyEntry.className = 'history-entry';
        historyEntry.textContent = formatHistoryEntry(entry);
        historyLogElement.appendChild(historyEntry);
    });
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