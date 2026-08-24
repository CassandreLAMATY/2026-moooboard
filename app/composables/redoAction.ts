import type { Shortcut } from "~/types/shortcut";

export default function redoAction(
    redoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]>,
    undoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]>,
    shortcuts: Ref<Shortcut[]>,
) {
    const action = redoActions.value.pop();

    if (action) {
        if (action.type === "SCTS") {
            shortcuts.value = action.currentValue;

            localStorage.setItem("moooboard:shortcuts", JSON.stringify(shortcuts.value));
        }

        undoActions.value.push(action);
    }
}
