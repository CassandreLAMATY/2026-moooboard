export default function getSessionTime(hours: number, minutes: number, seconds: number): number {
    const h = hours * 60 * 60;
    const m = minutes * 60;

    return h + m + seconds;
}
