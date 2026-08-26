<script setup lang="ts">
import getUsername from "~/composables/getUsername";
import type { Shortcut } from "~/types/shortcut";

const shortcutCreateIsOpen = ref(false);

const undoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]> = ref([]);
const redoActions: Ref<{ type: string; undoValue: any; currentValue: any }[]> = ref([]);

const shortcuts: Ref<Shortcut[]> = ref([]);

// Undo & Redo actions

function handleUndo() {
    undoAction(undoActions, redoActions, shortcuts);
}

function handleRedo() {
    redoAction(redoActions, undoActions, shortcuts);
}

// ---
// Sign In

const email = ref("");
const username = ref("");
const isLoggedIn = ref(false);

const isLoginOpen = ref(false);
const isRegisterOpen = ref(false);
const isRegisterCodeOpen = ref(false);

function openLogin() {
    isLoginOpen.value = true;
    isRegisterOpen.value = false;
    isRegisterCodeOpen.value = false;
}

function openRegister() {
    isLoginOpen.value = false;
    isRegisterOpen.value = true;
    isRegisterCodeOpen.value = false;
}

function openRegisterCode(e: string) {
    isLoginOpen.value = false;
    isRegisterOpen.value = false;
    isRegisterCodeOpen.value = true;

    email.value = e;
}

function handleResetData() {
    resetData(isLoggedIn, username, email);
}

function handleGetUsername() {
    getUsername(isLoggedIn, username, notifications, timeouts);
}

function handleRegister() {
    getUsername(isLoggedIn, username, notifications, timeouts);
    email.value = "";
}

// ---
// Notifications

const notifications: {
    notificationKey: number;
    title: string;
    type: "info" | "success" | "error";
    message: string;
    isRemove: boolean;
}[] = reactive([]);
const timeouts: { notificationKey: number; timeout: NodeJS.Timeout }[] = reactive([]);

function stopTimeout(notificationKey: number) {
    const timeout = timeouts[timeouts.findIndex((e) => e.notificationKey === notificationKey)];

    clearTimeout(timeout?.timeout);

    timeouts.splice(
        timeouts.findIndex((e) => e.notificationKey === notificationKey),
        1,
    );
}

function restartTimeout(notificationKey: number) {
    timeouts.push({
        notificationKey: notificationKey,
        timeout: removeNotification(notifications, timeouts, notificationKey, 5200),
    });
}

function deleteNotification(notificationKey: number) {
    notifications.splice(
        notifications.findIndex((e) => e.notificationKey === notificationKey),
        1,
    );
}

// ---
// Shortcuts

function handleCreateShortcut(scts: Shortcut[]) {
    const old = shortcuts.value;

    shortcuts.value = scts;

    handleNewAction(undoActions, redoActions, "SCTS", old, scts);
}

function handleDeleteShortcut(scts: Shortcut[], id: number) {
    shortcuts.value = deleteShortcut(scts, id);

    handleNewAction(undoActions, redoActions, "SCTS", scts, shortcuts.value);
}

onMounted(async () => {
    if (await checkIsUserConnected()) {
        handleGetUsername();
    }

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
            :username="username"
            @undo="handleUndo"
            @redo="handleRedo"
            @open-login="isLoginOpen = true"
            @log-out="handleResetData()"
            @notify="(e) => addNotification(notifications, timeouts, e)"
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

        <AccountLogInPopup
            v-if="isLoginOpen"
            @close="isLoginOpen = false"
            @open-register="openRegister()"
            @notify="(e) => addNotification(notifications, timeouts, e)"
        />

        <AccountCreatePopup
            v-if="isRegisterOpen"
            @open-login="openLogin()"
            @close="isRegisterOpen = false"
            @notify="(e) => addNotification(notifications, timeouts, e)"
            @submit="(e) => openRegisterCode(e)"
        />

        <AccountCreateCodePopup
            v-if="isRegisterCodeOpen"
            :email="email"
            @close="isRegisterCodeOpen = false"
            @notify="(e) => addNotification(notifications, timeouts, e)"
            @submit="handleRegister()"
        />

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
                :key="n.notificationKey"
                :notificationKey="n.notificationKey"
                :title="n.title"
                :type="n.type"
                :message="n.message"
                :is-remove="n.isRemove"
                @mouseenter="stopTimeout(n.notificationKey)"
                @mouseleave="restartTimeout(n.notificationKey)"
                @close="(e) => deleteNotification(e)"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/index.scss";
</style>
