<script setup lang="ts">
const props = defineProps<{
    undoLength: number;
    redoLength: number;
    username: string | undefined;
}>();
</script>

<template>
    <nav>
        <div class="action-container">
            <button
                :class="`btn-round ${undoLength > 0 ? 'active' : ''}`"
                type="button"
                title="Undo"
                @click="$emit('undo')"
            >
                <img v-if="undoLength > 0" src="/images/arrow-undo.svg" alt="Undo icon" />
                <img v-else src="/images/arrow-undo-grayed.svg" alt="Undo icon" />
            </button>

            <button
                :class="`btn-round ${redoLength > 0 ? 'active' : ''}`"
                type="button"
                title="Redo"
                @click="$emit('redo')"
            >
                <img v-if="redoLength > 0" src="/images/arrow-redo.svg" alt="Redo icon" />
                <img v-else src="/images/arrow-redo-grayed.svg" alt="Redo icon" />
            </button>
        </div>

        <div class="logo-container">
            <img src="/images/cow-face.svg" alt="MoooBoard Logo" />

            <span class="font01 micro01">MoooBoard</span>
        </div>

        <div class="profile-container">
            <button class="btn-icon-only" type="button">
                <img src="/images/gear.svg" alt="MoooBoard Logo" />
            </button>

            <button class="btn" type="button" @click="$emit('openLogin')">
                <img v-if="!username" src="/images/door-open-arrow-in.svg" alt="Door open icon" />
                <img v-else src="/images/user-white-02.svg" alt="User icon" />
                <span class="font02 micro02"> {{ username ? username : "Sign in" }} </span>
            </button>
        </div>
    </nav>
</template>

<style scoped lang="scss">
@use "~/assets/scss/navbar.scss";
</style>
