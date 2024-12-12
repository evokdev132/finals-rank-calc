export class LocalStorageService {
    static S4_CURRENT_POINTS = 'rankPoints';
    static S5_CURRENT_POINTS = 's5RankPoints';
    static DEPRECATED_HISTORY = 'historyLog';
    static S4_CURRENT_HISTORY = 'history';
    static S5_CURRENT_HISTORY = 's5history';
    static CURRENT_GRAPH = 'graphMode';

    static getCurrentPoints() {
        return LocalStorageService.#getInt(LocalStorageService.S5_CURRENT_POINTS);
    }

    static saveCurrentPoints(points) {
        LocalStorageService.#setInt(LocalStorageService.S5_CURRENT_POINTS, points);
    }

    static getGraphMode() {
        return LocalStorageService.#getString(LocalStorageService.CURRENT_GRAPH);
    }

    static saveGraphMode(mode) {
        LocalStorageService.#setString(LocalStorageService.CURRENT_GRAPH, mode);
    }

    static getHistory() {
        return LocalStorageService.#getArray(LocalStorageService.S5_CURRENT_HISTORY);
    }

    static saveHistory(history) {
        LocalStorageService.#setArray(LocalStorageService.S5_CURRENT_HISTORY, history);
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

    static #setArray(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static #getArray(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(localStorage.getItem(key)) : null;
    }
}