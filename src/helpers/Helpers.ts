export default class Helpers {
    static millisToMinutesAndSeconds(millis: number): [number, number] | undefined {
        const seconds = Math.floor(millis / 1000);
        const minutes = Math.floor(seconds / 60);

        if (minutes === 0 && seconds === 0) {
            return undefined;
        }

        return [minutes, seconds];
    }
}
