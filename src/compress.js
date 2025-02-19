import {LocalStorageService} from "./localStorage.service.js";

export class Compressor {
    static prepareExport() {
        const data = {
            history: LocalStorageService.getHistory(),
            currentPoints: LocalStorageService.getCurrentPoints()
        }
        return Compressor.#jsonToCompressedString(data);
    }

    static importData(stringData) {
        const data = Compressor.#compressedStringToJson(stringData);
        if (!data.history || !data.currentPoints) {
            throw new Error('Invalid string');
        }
        return data;
    }

    static #jsonToCompressedString(data) {
        const jsonString = JSON.stringify(data);
        const compressed = pako.deflate(jsonString, {level: 9});
        return btoa(String.fromCharCode(...compressed));
    }

    static #compressedStringToJson(compressedStr) {
        if (!isValidBase64(compressedStr)) {
            throw new Error("Invalid Base64 string");
        }
        const compressed = new Uint8Array(atob(compressedStr).split("").map(c => c.charCodeAt(0)));
        const jsonString = pako.inflate(compressed, {to: "string"});
        return JSON.parse(jsonString);
    }
}
function isValidBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (e) {
        return false;
    }
}
