import type { Shortcut } from "~/types/shortcut";

export default function useShortcuts() {
    const { shortcuts } = useAppStates();
    const { addAction } = useActions();

    function addShortcut(newShortcut: Shortcut) {
        const old = [...shortcuts.value];
        shortcuts.value.push(newShortcut);

        localStorage.setItem("moooboard:shortcuts", JSON.stringify(shortcuts.value));

        addAction("SCTS", old, shortcuts.value);
    }

    function removeShortcut(id: number) {
        const old = [...shortcuts.value];
        shortcuts.value = shortcuts.value.filter((e) => e.id !== id);

        localStorage.setItem("moooboard:shortcuts", JSON.stringify(shortcuts.value));

        addAction("SCTS", old, shortcuts.value);
    }

    return {
        shortcuts,
        addShortcut,
        removeShortcut,
    };
}
