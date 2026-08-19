<script setup lang="ts">
import { shortcutAddressSchema, shortcutTitleSchema } from "~/schemas/shortcutSchemas";
import type { Shortcut } from "~/types/shortcut";

const emit = defineEmits<{
    (event: "submit", payload: Shortcut[]): void;
    (event: "close"): void;
}>();

const isAdvancedActive = ref(true);

const title = ref("");
const address = ref("");
const backgroundColor = ref("151419");
const iconAddress = ref("/images/open-link.svg");

const titleIsValid = ref(false);
const addressIsValid = ref(false);

const titleError = ref("");
const addressError = ref("");

const backgroundColorRegex = /[^a-fA-F0-9]/g;

function submit() {
    if (titleIsValid.value && addressIsValid.value) {
        const shortcutsData = localStorage.getItem("moooboard:shortcuts");

        if (shortcutsData) {
            const shortcuts = JSON.parse(shortcutsData);
            const shortcut = {
                id: shortcuts.length,
                title: title.value,
                icon: iconAddress.value,
                iconAlt: "Shortcut icon",
                link: address.value,
                color: `#${backgroundColor.value}`,
            };

            shortcuts.push(shortcut);

            localStorage.setItem("moooboard:shortcuts", JSON.stringify(shortcuts));

            emit("submit", shortcuts);
            emit("close");

            return;
        }

        const shortcut = {
            id: 0,
            title: title.value,
            icon: iconAddress.value,
            iconAlt: "Shortcut icon",
            link: address.value,
            color: `#${backgroundColor.value}`,
        };

        localStorage.setItem("moooboard:shortcuts", JSON.stringify([shortcut]));

        emit("submit", [shortcut]);
        emit("close");

        return;
    }

    checkField(title.value, titleError, "shortcutTitle");
    checkField(address.value, addressError, "shortcutAddress");

    return;
}

watch(title, () => {
    try {
        shortcutTitleSchema.parse(title.value);

        titleIsValid.value = true;
    } catch (error) {
        titleIsValid.value = false;
    }
});

watch(address, () => {
    try {
        shortcutAddressSchema.parse(address.value);

        addressIsValid.value = true;
    } catch (error) {
        addressIsValid.value = false;
    }
});

watch(backgroundColor, () => {
    backgroundColor.value = backgroundColor.value.replace(backgroundColorRegex, "");

    if (backgroundColor.value.length > 6) backgroundColor.value = backgroundColor.value.substring(0, 6);
});
</script>

<template>
    <div class="popup-container" @click="$emit('close')">
        <div class="popup" @click.stop>
            <div class="header">
                <span class="font04 silk01">Create a shortcut</span>

                <button type="button" @click="$emit('close')">
                    <img src="/images/xmark.svg" alt="Xmark icon" />
                </button>
            </div>

            <div class="body">
                <form>
                    <div class="group">
                        <div class="container">
                            <div class="input-container">
                                <label class="font06 silk02" for="shortcutTitle">
                                    <span :class="titleError ? 'err' : ''">*</span> Title
                                </label>

                                <div class="input">
                                    <input
                                        class="font07"
                                        type="text"
                                        name="shortcutTitle"
                                        id="shortcutTitle"
                                        v-model="title"
                                        placeholder="Lorem ipsum"
                                        @focus="titleError = ''"
                                    />
                                    <img v-if="titleIsValid" src="/images/check.svg" alt="Check icon" />
                                    <img v-if="titleError" src="/images/xmark-red.svg" alt="Xmark icon" />
                                </div>
                            </div>

                            <span class="font05">{{ titleError }}</span>
                        </div>

                        <div class="container">
                            <div class="input-container">
                                <label class="font06 silk02" for="shortcutAddress">
                                    <span :class="addressError ? 'err' : ''">*</span> Address
                                </label>

                                <div class="input">
                                    <input
                                        class="font07"
                                        type="text"
                                        name="shortcutAddress"
                                        id="shortcutAddress"
                                        v-model="address"
                                        placeholder="https://www.lorem-ipsum.com"
                                        @focus="addressError = ''"
                                    />
                                    <img v-if="addressIsValid" src="/images/check.svg" alt="Check icon" />
                                    <img v-if="addressError" src="/images/xmark-red.svg" alt="Xmark icon" />
                                </div>
                            </div>
                            <span class="font05">{{ addressError }}</span>
                        </div>
                    </div>

                    <div class="advanced">
                        <button class="btn" type="button" @click="isAdvancedActive = !isAdvancedActive">
                            <div class="btn-content">
                                <img src="/images/gear-for-label.svg" alt="Gear icon" />
                                <span class="font02 micro02">Advanced settings</span>
                            </div>

                            <img
                                :class="isAdvancedActive ? 'active' : ''"
                                src="/images/chevron-down-small-2.svg"
                                alt="Chevron down icon"
                            />
                        </button>

                        <div v-if="isAdvancedActive" class="advanced-hidden">
                            <div class="group">
                                <div class="input-container">
                                    <label class="font06 silk02" for="shortcutBgColor">Background color</label>

                                    <div class="color-input-container">
                                        <div
                                            class="color-preview"
                                            :style="`background-color: #${backgroundColor};`"
                                        ></div>

                                        <div class="input">
                                            <span class="font02 micro02">#</span>
                                            <input
                                                class="font07"
                                                type="text"
                                                name="shortcutBgColor"
                                                id="shortcutBgColor"
                                                v-model="backgroundColor"
                                                placeholder="151419"
                                                @blur="backgroundColor = checkShortcutColor(backgroundColor)"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="preview-container">
                                    <span class="font06 silk02">Preview</span>

                                    <div class="preview" :style="`background-color: #${backgroundColor};`">
                                        <img :src="iconAddress" alt="Open link icon" />
                                    </div>
                                </div>
                            </div>

                            <div class="icon-container">
                                <div class="header">
                                    <span class="title font06 silk02">Icon</span>
                                    <span class="font02 micro02"
                                        >Where do you want to choose your icon from&nbsp;?</span
                                    >
                                </div>

                                <div class="content">
                                    <div class="btn-group">
                                        <button class="btn active" type="button">
                                            <img src="/images/folder.svg" alt="Folder icon" />
                                            <span class="font02 micro02">Library</span>
                                        </button>

                                        <button
                                            :class="`btn favicon ${addressIsValid ? 'active' : ''}`"
                                            type="button"
                                            @click="addressIsValid ? (iconAddress = getFaviconAddress(address)) : ''"
                                        >
                                            <img v-if="addressIsValid" src="/images/globe.svg" alt="Globe icon" />
                                            <img v-else src="/images/globe-grayed.svg" alt="Globe icon" />
                                            <span class="font02 micro02">Favicon</span>
                                        </button>
                                    </div>

                                    <div class="file-input" id="drop-zone">
                                        <img src="/images/import-grayed.svg" alt="Import icon" />

                                        <div class="content">
                                            <label class="font02 micro02" id="drop-zone">
                                                Upload a file
                                                <input type="file" name="shortcutIcon" id="shortcutIcon" />
                                            </label>

                                            <span class="font05"
                                                >You have to be connected in order to upload an icon</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <button class="btn" type="submit" @click="submit()">
                    <img src="/images/plus-small-green.svg" alt="Plus icon" />
                    <span class="font02 micro02">Create</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/shortcutCreatePopup.scss";
</style>
