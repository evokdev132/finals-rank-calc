import {
    pointsInputElement,
    secondRoundAddButtonElement,
    finalRoundAddButtonElement,
    finalWinAddButtonElement,
    weekChartButtonElement,
    monthChartButtonElement,
    seasonChartButtonElement,
    dayChartButtonElement,
    sessionChartButtonElement,
    ranksCheckboxElement,
    targetCheckboxElement
} from "./consts.js";
import {loadHistory} from "./history.js";
import {addPoints, renderCalculations, setPoints} from "./logic.js";
import {GraphClass, AnnotationConfig} from "./graph.js";
import {LocalStorageService} from "./localStorage.service.js";
import {DataService} from "./data.service.js";

export function initializeDom() {


    let typingTimer;
    const typingDelay = 1000;
    window.onload = function () {
        DataService.initHistory();
        loadHistory();

        let config;

        const savedPoints = LocalStorageService.getCurrentPoints();
        if (savedPoints) {
            pointsInputElement.value = savedPoints;
            renderCalculations();
        }

        const graphMode = LocalStorageService.getGraphMode();
        if (!graphMode) {
            LocalStorageService.saveGraphMode(GraphClass.CHART_OPTIONS.week)
        }

        const graphConfig = LocalStorageService.getGraphConfig();
        if (!graphConfig) {
            config = new AnnotationConfig(ranksCheckboxElement.checked, targetCheckboxElement.checked);
            LocalStorageService.saveGraphConfig(config.asObject());
        } else {
            config = AnnotationConfig.fromObject(graphConfig);
            ranksCheckboxElement.checked = config.ranks;
            targetCheckboxElement.checked = config.approximation;
        }

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

    ranksCheckboxElement.addEventListener('change', () => {
        GraphClass.showRanks(ranksCheckboxElement.checked);
    })
    targetCheckboxElement.addEventListener('change', () => {
        GraphClass.showApproximation(targetCheckboxElement.checked);
    })
}

initializeDom();