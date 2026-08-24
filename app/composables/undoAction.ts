import type { Shortcut } from "~/types/shortcut";

export default function undoAction(
    undoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]>,
    redoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]>,
    shortcuts: Ref<Shortcut[]>,
) {
    const action = undoActions.value.pop();

    if (action) {
        if (action.type === "SCTS") {
            shortcuts.value = action.undoValue;

            localStorage.setItem("moooboard:shortcuts", JSON.stringify(shortcuts.value));
        }

        redoActions.value.push(action);
    }
}
