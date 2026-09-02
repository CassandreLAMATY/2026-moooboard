<script setup lang="ts">
    import Switch from "./switch.vue";

    const submitIsLoading = ref(false);

    const focus = ref(45);
    const relax = ref(15);

    const buddies = [
        { id: 0, name: "Hungry Cow", formatted_name: "hungry-cow", image_base_url: "/images/pomodoro/cow" },
        { id: 1, name: "Sleepy Platy.", formatted_name: "sleepy-platy", image_base_url: "/images/pomodoro/platypus" },
        { id: 2, name: "Thirsty Cam.", formatted_name: "thirsty-cam", image_base_url: "/images/pomodoro/camel" },
        { id: 3, name: "Car", formatted_name: "car", image_base_url: "/images/pomodoro/cat" },
        { id: 4, name: "Cute Zibzorg", formatted_name: "cute-zibzorg", image_base_url: "/images/pomodoro/zibzorg" },
        { id: 5, name: "Rock", formatted_name: "rock", image_base_url: "/images/pomodoro/rock" },
        { id: 6, name: "Hot-Dog", formatted_name: "hot-dog", image_base_url: "/images/pomodoro/dog" },
        { id: 7, name: "Wet Snail", formatted_name: "wet-snail", image_base_url: "/images/pomodoro/snail" },
    ];
    const selectedBuddy = ref(0);
</script>

<template>
    <div
        class="popup-container"
        @click="$emit('close')"
    >
        <div
            class="popup"
            @click.stop
        >
            <div class="header">
                <span class="font04 silk01">Pomodoro settings</span>

                <button
                    type="button"
                    @click="$emit('close')"
                >
                    <img
                        src="/images/xmark.svg"
                        alt="Xmark icon"
                    />
                </button>
            </div>

            <form>
                <div class="content">
                    <div class="top">
                        <div class="container">
                            <div class="input-container">
                                <label
                                    class="font02 micro02"
                                    for="is-timetable"
                                    >Pomodoro based on timetable ?</label
                                >

                                <Switch name="is-timetable" />
                            </div>

                            <span class="font05">
                                Use the hours displayed in your <span class="underline">timetable</span> as a base for
                                your Pomodoro Timer focus sessions. Everything will be automated so you won’t have to
                                worry about anything !
                            </span>
                        </div>

                        <div class="group">
                            <div class="input-container">
                                <label
                                    class="font06 silk02"
                                    for="focus-duration"
                                >
                                    <span>*</span> Focus duration
                                </label>

                                <div class="input">
                                    <div class="btn-container">
                                        <button type="button">
                                            <img
                                                src="/images/chevron-up-small-white-07-8.svg"
                                                alt="Chevron up icon"
                                            />
                                        </button>
                                        <button type="button">
                                            <img
                                                src="/images/chevron-down-small-white-07-8.svg"
                                                alt="Chevron down icon"
                                            />
                                        </button>
                                    </div>

                                    <div class="wrapper">
                                        <input
                                            class="font08"
                                            type="number"
                                            name="focus-duration"
                                            id="focus-duration"
                                            v-model="focus"
                                        />

                                        <span class="font05">min.</span>
                                    </div>
                                </div>
                            </div>

                            <div class="input-container">
                                <label
                                    class="font06 silk02"
                                    for="relax-duration"
                                >
                                    <span>*</span> Relax duration
                                </label>

                                <div class="input">
                                    <div class="btn-container">
                                        <button type="button">
                                            <img
                                                src="/images/chevron-up-small-white-07-8.svg"
                                                alt="Chevron up icon"
                                            />
                                        </button>
                                        <button type="button">
                                            <img
                                                src="/images/chevron-down-small-white-07-8.svg"
                                                alt="Chevron down icon"
                                            />
                                        </button>
                                    </div>

                                    <div class="wrapper">
                                        <input
                                            class="font08"
                                            type="number"
                                            name="relax-duration"
                                            id="relax-duration"
                                            v-model="relax"
                                        />

                                        <span class="font05">min.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="separator"></div>

                    <div class="buddy-container">
                        <label
                            for="buddy"
                            class="font06 silk02"
                            >Choose your focus session buddy</label
                        >

                        <div class="container">
                            <PomodoroBuddy
                                v-for="b in buddies"
                                :id="b.id"
                                :src="b.image_base_url"
                                :name="b.name"
                                :inputId="b.formatted_name"
                                inputName="buddy"
                                :checked="b.id === selectedBuddy ? true : false"
                                @checked="(id) => (selectedBuddy = id)"
                            />
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <button
                        class="cancel"
                        type="button"
                        @click="$emit('close')"
                    >
                        <span class="font02 micro02">Cancel</span>
                    </button>

                    <button
                        :class="['submit', submitIsLoading ? 'loading' : '']"
                        type="submit"
                    >
                        <svg
                            v-if="submitIsLoading"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                class="dot01"
                                d="M6 10H2V14H6V10Z"
                                fill="#8F8C8F"
                            />
                            <path
                                class="dot02"
                                d="M14 10H10V14H14V10Z"
                                fill="#8F8C8F"
                            />
                            <path
                                class="dot03"
                                d="M22 10H18V14H22V10Z"
                                fill="#8F8C8F"
                            />
                        </svg>
                        <img
                            v-else
                            src="/images/check-light-green-24.svg"
                            alt="Check icon"
                        />
                        <span class="font02 micro02">Apply</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "~/assets/scss/pomodoroPopup.scss";
</style>
