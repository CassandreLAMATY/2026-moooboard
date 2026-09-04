<script setup lang="ts">
    const { notifications, stopTimeout, restartTimeout, deleteNotification } = useNotification();
    const { resetData } = useAppStates();
    const { shortcuts } = useShortcuts();

    // ---
    // Sign In

    const email = ref("");
    const codeType: Ref<"registration" | "login"> = ref("registration");

    const isLoginOpen = ref(false);
    const isRegisterOpen = ref(false);
    const isCodeOpen = ref(false);

    function openLogin() {
        isLoginOpen.value = true;
        isRegisterOpen.value = false;
        isCodeOpen.value = false;
    }

    function openRegister() {
        isLoginOpen.value = false;
        isRegisterOpen.value = true;
        isCodeOpen.value = false;
    }

    function openCode(data: { email: string; type: "registration" | "login" }) {
        email.value = data.email;
        codeType.value = data.type;

        isLoginOpen.value = false;
        isRegisterOpen.value = false;
        isCodeOpen.value = true;
    }

    function handleResetData() {
        resetData();
        email.value = "";
    }

    function handleFetchMe() {
        useFetchMe();
    }

    function handleRegister() {
        useFetchMe();
        email.value = "";
    }

    // ---
    // Shortcuts

    const shortcutCreateIsOpen = ref(false);

    // ---
    // Pomodoro

    const isPomodoroPopupOpen = ref(false);

    onMounted(async () => {
        if (await checkIsUserConnected()) {
            handleFetchMe();
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
            @open-login="isLoginOpen = true"
            @log-out="handleResetData()"
        />

        <div class="content">
            <ShortcutBox v-if="shortcuts.length > 0" />

            <DateSection />

            <PomodoroSection @open-settings="isPomodoroPopupOpen = true" />
        </div>

        <button
            class="btn shortcut-add"
            type="button"
            @click="shortcutCreateIsOpen = true"
        >
            <span class="font02 micro02">Shortcut</span>
            <img
                src="/images/plus-small.svg"
                alt="Plus icon"
            />
        </button>

        <!-- Account -->

        <AccountLogInPopup
            v-if="isLoginOpen"
            @close="isLoginOpen = false"
            @open-register="openRegister()"
            @submit="(e) => openCode(e)"
        />

        <AccountCreatePopup
            v-if="isRegisterOpen"
            @open-login="openLogin()"
            @close="isRegisterOpen = false"
            @submit="(e) => openCode(e)"
        />

        <AccountCodePopup
            v-if="isCodeOpen"
            :email="email"
            :type="codeType"
            @close="isCodeOpen = false"
            @submit="handleRegister()"
        />

        <!-- Shortcuts -->

        <ShortcutCreatePopup
            v-if="shortcutCreateIsOpen"
            @close="shortcutCreateIsOpen = false"
        />

        <!-- Pomodoro -->

        <PomodoroPopup
            v-if="isPomodoroPopupOpen"
            @close="isPomodoroPopupOpen = false"
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
