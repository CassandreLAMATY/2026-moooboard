export default function checkShortcutColor(c: string): string {
    if (c.length === 3 || c.length === 6) return c;

    return c.padEnd(6, "0");
}
