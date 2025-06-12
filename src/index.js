import {
    pointsInputElement,
    firstRoundAddButtonElement,
    secondRoundAddButtonElement,
    finalRoundAddButtonElement,
    finalWinAddButtonElement,
    weekChartButtonElement,
    monthChartButtonElement,
    seasonChartButtonElement,
    dayChartButtonElement,
    sessionChartButtonElement,
    checkboxes,
    displayCheckboxes,
    ChartConfigOption,
    exportButtonElement,
    importButtonElement
} from "./consts.js";
import {loadHistory} from "./history.js";
import {addPoints, renderCalculations, setPoints, deleteEntry} from "./logic.js";
import {GraphClass} from "./graph.js";
import {LocalStorageService} from "./localStorage.service.js";
import {DataService} from "./data.service.js";
import {loadExportModal, loadImportModal} from "./modal.js";

export function initializeDom() {


    let typingTimer;
    const typingDelay = 1000;
    window.onload = function () {
        DataService.initHistory();
        loadHistory(deleteEntry);

        const savedPoints = LocalStorageService.getCurrentPoints();
        if (savedPoints) {
            pointsInputElement.value = savedPoints;
            renderCalculations();
        }

        const graphMode = LocalStorageService.getGraphMode();
        if (!graphMode) {
            LocalStorageService.saveGraphMode(GraphClass.CHART_OPTIONS.week)
        }

        // add config
        loadDisplayConfig();
        GraphClass.createChart();
    };


    pointsInputElement.addEventListener('input', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            setPoints(pointsInputElement.value)
        }, typingDelay);
    });

    pointsInputElement.addEventListener('keydown', () => {
        clearTimeout(typingTimer);
    });


    firstRoundAddButtonElement.addEventListener('click', () => {
        addPoints(2);
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

    sessionChartButtonElement.addEventListener('click', () => {
        GraphClass.setChartMode(GraphClass.CHART_OPTIONS.session)
    })
    dayChartButtonElement.addEventListener('click', () => {
        GraphClass.setChartMode(GraphClass.CHART_OPTIONS.day)
    })
    weekChartButtonElement.addEventListener('click', () => {
        GraphClass.setChartMode(GraphClass.CHART_OPTIONS.week)
    })
    monthChartButtonElement.addEventListener('click', () => {
        GraphClass.setChartMode(GraphClass.CHART_OPTIONS.month)
    })
    seasonChartButtonElement.addEventListener('click', () => {
        GraphClass.setChartMode(GraphClass.CHART_OPTIONS.season)
    })
    exportButtonElement.addEventListener('click', loadExportModal);
    importButtonElement.addEventListener('click', loadImportModal);

    document.addEventListener('DOMContentLoaded', () => {
        loadColumnsState();
        loadDisplayConfigState();
        Object.keys(checkboxes).forEach(id => {
            document.getElementById(id).addEventListener('change', () => toggleColumn(id));
        });
        Object.keys(displayCheckboxes).forEach(id => {
            document.getElementById(id).addEventListener('change', () => toggleDisplayConfig(id));
        })
    });
}

function loadColumnsState() {
    Object.keys(checkboxes).forEach(id => {
        const checkbox = document.getElementById(id);
        const column = document.getElementById(checkboxes[id]);
        const savedState = localStorage.getItem(id);

        if (savedState !== null) {
            checkbox.checked = savedState === 'true';
        } else {
            checkbox.checked = true;
        }

        column.classList.toggle('hidden', !checkbox.checked);
    });
}

function toggleColumn(id) {
    const checkbox = document.getElementById(id);
    const column = document.getElementById(checkboxes[id]);
    column.classList.toggle('hidden', !checkbox.checked);
    localStorage.setItem(id, checkbox.checked);
}

function loadDisplayConfig() {
    let graphConfig = LocalStorageService.getGraphConfig();
    if (Object.is(graphConfig, null)) {
        graphConfig = {
            [ChartConfigOption.RANKS]: true,
            [ChartConfigOption.TARGET]: false
        };
        LocalStorageService.saveGraphConfig(graphConfig);
    }

    return graphConfig;
}

function loadDisplayConfigState() {
    const graphConfig = loadDisplayConfig();
    Object.keys(displayCheckboxes).forEach(id => {
        const checkbox = document.getElementById(id);
        const savedState = graphConfig[displayCheckboxes[id]];

        // if key does not exist, then it's undefined and !== null will be false(!)
        if (savedState != null) {
            checkbox.checked = savedState;
        } else {
            checkbox.checked = false;
        }
    });
}

function toggleDisplayConfig(id) {
    const checkbox = document.getElementById(id);
    GraphClass.setConfig(displayCheckboxes[id], checkbox.checked)
}

initializeDom();
loadColumnsState();