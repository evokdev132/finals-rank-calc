import {Compressor} from "./compress.js";
import {DataService} from "./data.service.js";
import {renderCalculations} from "./logic.js";
import {GraphClass} from "./graph.js";

export function loadExportModal() {
    fetch('export.modal.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('exportModalContainer').innerHTML = data;
            addExportModalEvents();
        })
        .catch(error => console.error('Cant load modal:', error));
}

export function loadImportModal() {
    fetch('import.modal.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('importModalContainer').innerHTML = data;
            addImportModalEvents();
        })
        .catch(error => console.error('Cant load modal:', error));
}


function processImportedData() {
    const importedString = document.getElementById("inputText").value.trim();
    if (!importedString) {
        alert('No import string');
        return;
    }

    const data = Compressor.importData(importedString);
    DataService.setHistory(data.history);
    DataService.setPoints(data.currentPoints);
    renderCalculations();
    GraphClass.updateChart();
}



function addExportModalEvents() {
    const modal = document.getElementById('exportModal');
    const closeBtn = document.getElementById('exportClose');

    modal.style.display = 'block';

    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };

    document.getElementById('clipboardButton').addEventListener('click', function() {
        const text = Compressor.prepareExport();
        copyToClipboard(text);
    });

    document.getElementById('fileButton').addEventListener('click', function() {
        const text = Compressor.prepareExport();
        downloadStringAsFile(text);
    });

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}


function addImportModalEvents() {
    const modal = document.getElementById('importModal');
    const closeBtn = document.getElementById('importClose');

    modal.style.display = 'block';

    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };

    document.getElementById("importButton").addEventListener("click", processImportedData);

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('Copied to the clipboard'))
        .catch(err => console.error('Failed to copy:', err));
}

function downloadStringAsFile(text, filename = 'data.txt') {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}