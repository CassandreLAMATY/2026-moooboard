<script setup lang="ts">
import type { Notification } from "~/types/notification";
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

            localStorage.setItem("moooboard:shortcuts", JSON.stringify(shortcuts.value));
        }

        redoActions.value.push(action);
    }
}

function redoAction() {
    const action = redoActions.value.pop();

    if (action) {
        if (action.type === "SCTS") {
            shortcuts.value = action.currentValue;

            localStorage.setItem("moooboard:shortcuts", JSON.stringify(shortcuts.value));
        }

        undoActions.value.push(action);
    }
}

// ---
// Sign In

const isLoginOpen = ref(false);
const isRegisterOpen = ref(false);

function openLogin() {
    isLoginOpen.value = true;
    isRegisterOpen.value = false;
}

function openRegister() {
    isLoginOpen.value = false;
    isRegisterOpen.value = true;
}

// ---
// Notifications

const notifications: {
    key: number;
    title: string;
    type: "info" | "success" | "error";
    message: string;
    isRemove: boolean;
}[] = reactive([]);
const timeouts: { key: number; timeout: NodeJS.Timeout }[] = reactive([]);

function removeNotification(key: number, timeout: number): NodeJS.Timeout {
    return setTimeout(() => {
        notifications.splice(
            notifications.findIndex((e) => e.key === key),
            1,
        );
    }, timeout);
}

function addNotification(payload: Notification) {
    notifications.push({
        key: notifications.length,
        title: payload.title,
        type: payload.type,
        message: payload.message,
        isRemove: true,
    });

    timeouts.push({ key: notifications.length - 1, timeout: removeNotification(notifications.length - 1, 5200) });
}

function stopTimeout(key: number) {
    const timeout = timeouts[timeouts.findIndex((e) => e.key === key)];

    clearTimeout(timeout?.timeout);

    timeouts.splice(
        timeouts.findIndex((e) => e.key === key),
        1,
    );
}

function restartTimeout(key: number) {
    removeNotification(key, 5200);
}

function deleteNotification(key: number) {
    notifications.splice(
        notifications.findIndex((e) => e.key === key),
        1,
    );
}

// ---
// Shortcuts

function handleCreateShortcut(scts: Shortcut[]) {
    const old = shortcuts.value;

    shortcuts.value = scts;

    handleNewAction("SCTS", old, scts);
}

function handleDeleteShortcut(scts: Shortcut[], id: number) {
    shortcuts.value = deleteShortcut(scts, id);

    handleNewAction("SCTS", scts, shortcuts.value);
}

onMounted(async () => {
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
            @open-login="isLoginOpen = true"
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

        <!-- Account -->

        <AccountLogInPopup v-if="isLoginOpen" @close="isLoginOpen = false" @open-register="openRegister()" />

        <AccountCreatePopup
            v-if="isRegisterOpen"
            @open-login="openLogin()"
            @close="isRegisterOpen = false"
            @notify="(e: Notification) => addNotification(e)"
        />

        <AccountCreateCodePopup email="cassandre.lamaty@gmail.com" />

        <!-- Shortcuts -->

        <ShortcutCreatePopup
            v-if="shortcutCreateIsOpen"
            @close="shortcutCreateIsOpen = false"
            @submit="(e) => handleCreateShortcut(e)"
        />

        <!-- Notifications -->

        <div class="notification-container">
            <Notification
                v-for="n in notifications"
                :key="n.key"
                :title="n.title"
                :type="n.type"
                :message="n.message"
                :is-remove="n.isRemove"
                @mouseenter="stopTimeout(n.key)"
                @mouseleave="restartTimeout(n.key)"
                @close="(e: number) => deleteNotification(e)"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/index.scss";
</style>
