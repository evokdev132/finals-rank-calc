import {historyLogElement} from "./consts.js";

export function saveHistory(pointsAdded) {
    const timestamp = new Date();
    const formattedDate = timestamp.toLocaleDateString('en-GB'); // DD-MM-YY
    const formattedTime = timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const entry = `${formattedDate} ${formattedTime} +${pointsAdded}`;

    const history = JSON.parse(localStorage.getItem('historyLog')) || [];
    history.push(entry);
    localStorage.setItem('historyLog', JSON.stringify(history));

    loadHistory();
}

export function loadHistory() {
    const history = JSON.parse(localStorage.getItem('historyLog')) || [];
    historyLogElement.innerHTML = ''; // Clear existing entries

    history.reverse().forEach(entry => {
        const historyEntry = document.createElement('div');
        historyEntry.className = 'history-entry';
        historyEntry.textContent = entry;
        historyLogElement.appendChild(historyEntry);
    });
}