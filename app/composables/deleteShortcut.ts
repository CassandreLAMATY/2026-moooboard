import type { Shortcut } from "~/types/shortcut";

export default function deleteShortcut(shortcuts: Shortcut[], id: number): Shortcut[] {
    const result = shortcuts.filter((e) => e.id !== id);

    localStorage.setItem("moooboard:shortcuts", JSON.stringify(result));

    return result;
}
