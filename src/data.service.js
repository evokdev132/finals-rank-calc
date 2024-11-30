// model = {
//     season: number;
//     date: Date;
//     gain: number;
//     currentPoints: number;
// }

import {LocalStorageService} from "./localStorage.service.js";
import {currentSeason} from "./consts.js";

export class DataService {
    static initHistory() {
        const history = LocalStorageService.getHistory();
        if (!history) {
            LocalStorageService.saveHistory([]);
        }
    }

    static retrieveHistory(limit) {
        const history = LocalStorageService.getHistory();
        return limit ? history.slice(limit - 1, history.length) : history;
    }

    static saveToHistory(points, currentPoints) {
        const history = LocalStorageService.getHistory();
        const currentDate =new Date();
        history.push({
            season: currentSeason,
            // dont judge me
            date: currentDate.toLocaleString('sv-SE').replace(' ', 'T') + `.${String(currentDate.getMilliseconds()).padStart(3, '0')}`,
            gain: points,
            currentPoints
        });
        LocalStorageService.saveHistory(history);
    }
}