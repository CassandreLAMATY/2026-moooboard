<script setup lang="ts">
const props = defineProps<{
    id: number;
    src: string;
    name: string;
    inputId: string;
    inputName: string;
    checked: boolean;
}>();

const emit = defineEmits<{
    (event: "checked", payload: number): void;
}>();

const isHovered = ref(false);
</script>

<template>
    <div
        :class="['buddy-container', checked ? 'active' : '']"
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <img :src="`${src}${!isHovered ? '01.svg' : '02.svg'}`" :alt="name" />
        <span class="font10 micro10">{{ name }}</span>

        <input type="radio" :name="inputName" :id="inputId" :checked="checked" @click="$emit('checked', id)" />
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/pomodoroBuddy.scss";
</style>
