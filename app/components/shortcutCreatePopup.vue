<script setup lang="ts">
const isAdvancedActive = ref(true);

const title = ref("");
const address = ref("");
const backgroundColor = ref("151419");

const titleIsValid = ref(false);
const addressIsValid = ref(false);
const backgroundColorIsValid = ref(false);

const titleError = ref("erreur danger méchant");
const addressError = ref("");
</script>

<template>
    <div class="popup-container">
        <div class="popup">
            <div class="header">
                <span class="font04 silk01">Create a shortcut</span>

                <button type="button">
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
                                        <div class="color-preview"></div>
                                        <div class="input">
                                            <span class="font02 micro02">#</span>
                                            <input
                                                class="font07"
                                                type="text"
                                                name="shortcutBgColor"
                                                id="shortcutBgColor"
                                                v-model="backgroundColor"
                                                placeholder="151419"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="preview-container">
                                    <span class="font06 silk02">Preview</span>

                                    <div class="preview">
                                        <img src="/images/open-link.svg" alt="Open link icon" />
                                    </div>
                                </div>
                            </div>

                            <div class="icon-container">
                                <div class="header">
                                    <span class="title font06 silk02">Icon</span>
                                    <span class="font02 micro02">Where do you want to choose your icon from ?</span>
                                </div>

                                <div class="content">
                                    <div class="btn-group">
                                        <button class="btn" type="button">
                                            <img src="/images/folder.svg" alt="Folder icon" />
                                            <span class="font02 micro02">Library</span>
                                        </button>

                                        <button class="btn" type="button">
                                            <img src="/images/globe.svg" alt="Globe icon" />
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

                <button class="btn" type="submit">
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
