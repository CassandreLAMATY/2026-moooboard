<script setup lang="ts">
    const emit = defineEmits<{
        (event: "close"): void;
    }>();

    const { buddies, selectedBuddy, fetchBuddies, updateSelectedBuddy } = useBuddies();

    const selectedBuddyId = ref(selectedBuddy.value.id);
    const buddiesIsLoading = ref(true);

    const submitIsLoading = ref(false);

    const focus = ref(45);
    const relax = ref(15);

    async function submit() {
        submitIsLoading.value = true;

        const buddy = buddies.value.filter((b) => b.id === selectedBuddyId.value)[0];

        if (buddy) {
            await updateSelectedBuddy(buddy);
        }

        submitIsLoading.value = false;

        emit("close");
    }

    onMounted(async () => {
        await fetchBuddies().then(() => {
            buddiesIsLoading.value = false;
        });
    });
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

            <form @submit.prevent="submit()">
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

                        <div :class="['container', buddiesIsLoading ? 'loading' : '']">
                            <svg
                                v-if="buddiesIsLoading"
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
                            <PomodoroBuddy
                                v-else
                                v-for="b in buddies"
                                :id="b.id"
                                :src="b.image_base_url"
                                :name="b.name"
                                :inputId="b.formatted_name"
                                inputName="buddy"
                                :checked="b.id === selectedBuddyId ? true : false"
                                @checked="(id) => (selectedBuddyId = id)"
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
