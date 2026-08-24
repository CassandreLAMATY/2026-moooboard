export default function handleNewAction(
    undoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]>,
    redoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]>,
    type: string,
    undoValue: any,
    currentValue: any,
) {
    undoActions.value.push({
        type: type,
        undoValue: undoValue,
        currentValue: currentValue,
    });

    redoActions.value = [];
}
