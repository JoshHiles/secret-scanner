"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helpers {
    static millisToMinutesAndSeconds(millis) {
        const seconds = Math.floor(millis / 1000);
        const minutes = Math.floor(seconds / 60);
        if (minutes === 0 && seconds === 0) {
            return undefined;
        }
        return [minutes, seconds];
    }
}
exports.default = Helpers;
