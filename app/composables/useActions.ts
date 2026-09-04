import type { Action } from "~/types/action";

export default function useActions() {
    const undo = useState<Action[]>("undo", () => []);
    const redo = useState<Action[]>("redo", () => []);

    const { shortcuts } = useAppStates();

    function addAction(type: string, undoValue: any, currentValue: any) {
        undo.value.push({
            type: type,
            undoValue: undoValue,
            currentValue: currentValue,
        });

        redo.value = [];
    }

    function undoAction() {
        const action = undo.value.pop();

        if (action) {
            if (action.type === "SCTS") {
                shortcuts.value = action.undoValue;

                localStorage.setItem("moooboard:shortcuts", JSON.stringify(shortcuts.value));
            }

            redo.value.push(action);
        }
    }

    function redoAction() {
        const action = redo.value.pop();

        if (action) {
            if (action.type === "SCTS") {
                shortcuts.value = action.currentValue;

                localStorage.setItem("moooboard:shortcuts", JSON.stringify(shortcuts.value));
            }

            undo.value.push(action);
        }
    }

    return {
        undo,
        redo,
        addAction,
        undoAction,
        redoAction,
    };
}
