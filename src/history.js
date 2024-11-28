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