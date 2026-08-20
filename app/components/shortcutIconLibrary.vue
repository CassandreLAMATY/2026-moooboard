<script setup lang="ts">
const emit = defineEmits<{
    (event: "submit", payload: { icon: string; iconAlt: string; selectedColor: number; selectedIcon: number }): void;
    (event: "close"): void;
}>();

const props = defineProps<{
    selectedColor: number;
    selectedIcon: number;
}>();

const colors = ref([
    { name: "white", hex: "#f9f9f9" },
    { name: "white-02", hex: "#e2e2e2" },
    { name: "white-04", hex: "#c8c8ca" },
    { name: "white-06", hex: "#b3b1b2" },
    { name: "white-08", hex: "#9a989a" },
    { name: "black-10", hex: "#827f82" },
    { name: "black-07", hex: "#5e5c5f" },
    { name: "black-05", hex: "#464348" },
    { name: "black-03", hex: "#2d2b30" },
    { name: "black-01", hex: "#151419" },
    { name: "black", hex: "#08070d" },
    { name: "light-green", hex: "#bedd9b" },
    { name: "light-blue", hex: "#98c1ff" },
    { name: "light-purple", hex: "#b7abff" },
    { name: "light-red", hex: "#db4d47" },
    { name: "light-yellow", hex: "#ffd37a" },
]);

const icons = ref([
    {
        url: "/images/open-link-white.svg",
        name: "open-link",
        alt: "Open link icon",
    },
    {
        url: "/images/paperclip-white.svg",
        name: "paperclip",
        alt: "Paperclip icon",
    },
    {
        url: "/images/document-blank-white.svg",
        name: "document-blank",
        alt: "Blank document icon",
    },
    {
        url: "/images/document-white.svg",
        name: "document",
        alt: "Document icon",
    },
    {
        url: "/images/invoice-white.svg",
        name: "invoice",
        alt: "Invoice icon",
    },
    {
        url: "/images/cv-white.svg",
        name: "cv",
        alt: "CV icon",
    },
    {
        url: "/images/pencil-white.svg",
        name: "pencil",
        alt: "Pencil icon",
    },
    {
        url: "/images/pencil-line-white.svg",
        name: "pencil-line",
        alt: "Pencil with line icon",
    },
    {
        url: "/images/folder-white.svg",
        name: "folder",
        alt: "Folder icon",
    },
    {
        url: "/images/twitch-white.svg",
        name: "twitch",
        alt: "Twitch icon",
    },
    {
        url: "/images/instagram-white.svg",
        name: "instagram",
        alt: "Instagram icon",
    },
    {
        url: "/images/youtube-white.svg",
        name: "youtube",
        alt: "Youtube icon",
    },
    {
        url: "/images/x-white.svg",
        name: "x",
        alt: "X icon",
    },
]);

// Library drag

const libraryDragX = ref(0);
const libraryDragY = ref(0);

const initCursorX = ref(0);
const initCursorY = ref(0);

function setCursorPosition(e: MouseEvent) {
    if (e.button !== 0) return;

    initCursorX.value = e.pageX - libraryDragX.value;
    initCursorY.value = e.pageY - libraryDragY.value;
}

function resetCursorPosition() {
    initCursorX.value = 0;
    initCursorY.value = 0;
}

function dragLibrary(e: MouseEvent) {
    if (e.buttons !== 1) return;

    libraryDragX.value = e.pageX - initCursorX.value;
    libraryDragY.value = e.pageY - initCursorY.value;
}

//---

function submit(i: number) {
    const iconName = `${icons.value[i]!.name}-${colors.value[props.selectedColor]!.name}.svg`;

    emit("submit", {
        icon: iconName,
        iconAlt: icons.value[i]!.alt,
        selectedColor: props.selectedColor,
        selectedIcon: i,
    });
}

function updateColorSubmit(i: number) {
    const iconName = `${icons.value[props.selectedIcon]!.name}-${colors.value[i]!.name}.svg`;

    emit("submit", {
        icon: iconName,
        iconAlt: icons.value[props.selectedIcon]!.alt,
        selectedColor: i,
        selectedIcon: props.selectedIcon,
    });
}
</script>

<template>
    <div
        class="lib-popup"
        @click.stop
        :style="`top: calc(65% + ${libraryDragY}px); left: calc(50% + ${libraryDragX}px)`"
    >
        <div class="header">
            <div class="left">
                <img
                    src="/images/grip-dots.svg"
                    alt="Grip icon"
                    draggable="false"
                    @mousedown="(e) => setCursorPosition(e)"
                    @mousemove="(e) => dragLibrary(e)"
                    @mouseup="resetCursorPosition()"
                />
                <span class="font04 silk01">Icon library</span>
            </div>

            <button type="button" @click="$emit('close')">
                <img src="/images/xmark.svg" alt="Xmark icon" />
            </button>
        </div>

        <div class="content">
            <div class="group">
                <div class="input">
                    <span class="font06 silk02">Color</span>
                    <div class="colors-container">
                        <button
                            v-for="(c, i) in colors"
                            :class="i === selectedColor ? 'selected' : ''"
                            type="button"
                            :style="`background-color: ${c.hex};`"
                            @click="updateColorSubmit(i)"
                        ></button>
                    </div>
                </div>
            </div>

            <div class="group">
                <div class="input">
                    <span class="font06 silk02">Icon</span>
                    <div class="icons-container">
                        <button
                            v-for="(e, i) in icons"
                            :class="i === selectedIcon ? 'selected' : ''"
                            type="button"
                            @click="submit(i)"
                        >
                            <img :src="e.url" :alt="e.alt" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/shortcutIconLibrary.scss";
</style>
