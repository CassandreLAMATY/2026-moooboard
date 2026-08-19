<script setup lang="ts">
import type { Shortcut } from "~/types/shortcut";

const shortcutCreateIsOpen = ref(false);

const undoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]> = ref([]);
const redoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]> = ref([]);

const shortcuts: Ref<Shortcut[]> = ref([]);

// Undo & Redo actions

function handleNewAction(type: string, undoValue: any, currentValue: any) {
    undoActions.value.push({
        type: type,
        undoValue: undoValue,
        currentValue: currentValue,
    });

    redoActions.value = [];
}

function undoAction() {
    const action = undoActions.value.pop();

    if (action) {
        if (action.type === "SCTS") {
            shortcuts.value = action.undoValue;
        }

        redoActions.value.push(action);
    }
}

function redoAction() {
    const action = redoActions.value.pop();

    if (action) {
        if (action.type === "SCTS") {
            shortcuts.value = action.currentValue;
        }

        undoActions.value.push(action);
    }
}

// ---
// Shortcuts

function handleDeleteShortcut(scts: Shortcut[], id: number) {
    shortcuts.value = deleteShortcut(scts, id);

    handleNewAction("SCTS", scts, shortcuts.value);
}

onMounted(() => {
    const shortcutsData = localStorage.getItem("moooboard:shortcuts");

    if (shortcutsData) {
        shortcuts.value = JSON.parse(shortcutsData);
    }
});
</script>

<template>
    <div class="page">
        <Navbar
            :undo-length="undoActions.length"
            :redo-length="redoActions.length"
            @undo="undoAction()"
            @redo="redoAction"
        />

        <ShortcutBox
            v-if="shortcuts.length > 0"
            :shortcuts="shortcuts"
            @delete="(e: Shortcut) => handleDeleteShortcut(shortcuts, e.id)"
        />

        <button class="btn shortcut-add" type="button" @click="shortcutCreateIsOpen = true">
            <span class="font02 micro02">Shortcut</span>
            <img src="/images/plus-small.svg" alt="Plus icon" />
        </button>

        <ShortcutCreatePopup
            v-if="shortcutCreateIsOpen"
            @close="shortcutCreateIsOpen = false"
            @submit="(e) => (shortcuts = e)"
        />
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/index.scss";
</style>
