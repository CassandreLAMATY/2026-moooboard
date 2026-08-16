export default function findShortcutsToShow(ctnWidth: number, sWidth: number, sGap: number): number {
    const n = Math.floor(ctnWidth / (sWidth + sGap));

    return n;
}
