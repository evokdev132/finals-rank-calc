export class LocalStorageService {
    static S4_CURRENT_POINTS = 'rankPoints';
    static S5_CURRENT_POINTS = 's5RankPoints';
    static S6_CURRENT_POINTS = 's6RankPoints';
    static S7_CURRENT_POINTS = 's7RankPoints';
    static DEPRECATED_HISTORY = 'historyLog';
    static S4_CURRENT_HISTORY = 'history';
    static S5_CURRENT_HISTORY = 's5history';
    static S6_CURRENT_HISTORY = 's6history';
    static S7_CURRENT_HISTORY = 's7history';
    static CURRENT_GRAPH = 'graphMode';
    static GRAPH_CONFIG = 'graphConfig';

    static getCurrentPoints() {
        return LocalStorageService.#getInt(LocalStorageService.S7_CURRENT_POINTS);
    }

    static saveCurrentPoints(points) {
        LocalStorageService.#setInt(LocalStorageService.S7_CURRENT_POINTS, points);
    }

    static getGraphMode() {
        return LocalStorageService.#getString(LocalStorageService.CURRENT_GRAPH);
    }

    static saveGraphMode(mode) {
        LocalStorageService.#setString(LocalStorageService.CURRENT_GRAPH, mode);
    }

    static getHistory() {
        return LocalStorageService.#getObject(LocalStorageService.S7_CURRENT_HISTORY);
    }

    static saveHistory(history) {
        LocalStorageService.#setObject(LocalStorageService.S7_CURRENT_HISTORY, history);
    }

    static getGraphConfig() {
        return LocalStorageService.#getObject(LocalStorageService.GRAPH_CONFIG);
    }

    static saveGraphConfig(config) {
        LocalStorageService.#setObject(LocalStorageService.GRAPH_CONFIG, config);
    }

    static #setInt(key, value) {
        localStorage.setItem(key, `${value}`);
    }

    static #getInt(key) {
        return Number.parseInt(localStorage.getItem(key));
    }

    static #setString(key, value) {
        localStorage.setItem(key, `${value}`);
    }

    static #getString(key) {
        return localStorage.getItem(key);
    }

    static #setObject(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static #getObject(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(localStorage.getItem(key)) : null;
    }
}