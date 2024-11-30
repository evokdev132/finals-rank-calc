export class LocalStorageService {
    static CURRENT_POINTS = 'rankPoints';
    static DEPRECATED_HISTORY = 'historyLog';
    static CURRENT_HISTORY = 'history';
    static CURRENT_GRAPH = 'graphMode';

    static getCurrentPoints() {
        return LocalStorageService.#getInt(LocalStorageService.CURRENT_POINTS);
    }

    static saveCurrentPoints(points) {
        LocalStorageService.#setInt(LocalStorageService.CURRENT_POINTS, points);
    }

    static getGraphMode() {
        return LocalStorageService.#getString(LocalStorageService.CURRENT_GRAPH);
    }

    static saveGraphMode(mode) {
        LocalStorageService.#setString(LocalStorageService.CURRENT_GRAPH, mode);
    }

    static getHistory() {
        return LocalStorageService.#getArray(LocalStorageService.CURRENT_HISTORY);
    }

    static saveHistory(history) {
        LocalStorageService.#setArray(LocalStorageService.CURRENT_HISTORY, history);
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