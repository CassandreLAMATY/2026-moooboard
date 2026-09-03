<script setup lang="ts">
    const emit = defineEmits<{
        (event: "openSettings"): void;
    }>();

    const initFocus = [0, 45, 0];
    const initRelax = [0, 15, 0];
    const hasHours = ref(initFocus[0] === 0 && initRelax[0] === 0 ? false : true);

    const timer = ref([...initFocus]);

    const totalSessionTime = ref(getSessionTime(timer.value[0]!, timer.value[1]!, timer.value[2]!));
    const sessionTime = ref(0);

    const isFocusPlaying = ref(true);
    const isAnimationPaused = ref(true);

    const isFrame1Displayed = ref(true);

    const gradientAngle = computed(() => {
        if (!totalSessionTime.value) {
            return 0;
        }

        const elapsed = totalSessionTime.value - sessionTime.value;

        return (elapsed / totalSessionTime.value) * 360;
    });

    const interval: Ref<NodeJS.Timeout | undefined> = ref(undefined);
    const iconTimeout: Ref<NodeJS.Timeout | undefined> = ref(undefined);

    function initSessionTime() {
        sessionTime.value = totalSessionTime.value = getSessionTime(timer.value[0]!, timer.value[1]!, timer.value[2]!);
    }

    function setSessionInterval() {
        interval.value = setInterval(() => {
            if (timer.value[0] === 0 && timer.value[1] === 0 && timer.value[2] === 0) {
                isFocusPlaying.value = !isFocusPlaying.value;

                if (isFocusPlaying.value) {
                    timer.value = [...initFocus];
                    initSessionTime();

                    return;
                }

                timer.value = [...initRelax];
                initSessionTime();

                return;
            }

            if (timer.value[2] === 0 && timer.value[1]! > 0) {
                timer.value[2] = 59;
                timer.value[1]! -= 1;
                sessionTime.value = getSessionTime(timer.value[0]!, timer.value[1]!, timer.value[2]!);

                return;
            }

            if (timer.value[2] === 0 && timer.value[0]! > 0) {
                timer.value[2] = 59;
                timer.value[1] = 59;
                timer.value[0]! -= 1;
                sessionTime.value = getSessionTime(timer.value[0]!, timer.value[1]!, timer.value[2]!);

                return;
            }

            timer.value[2]! -= 1;
            sessionTime.value = getSessionTime(timer.value[0]!, timer.value[1]!, timer.value[2]!);
        }, 1000);
    }

    function startSession() {
        if (!isAnimationPaused.value) {
            isAnimationPaused.value = true;

            clearInterval(interval.value);
            clearTimeout(iconTimeout.value);
            return;
        }

        if (sessionTime.value <= 0) {
            initSessionTime();
        }

        isAnimationPaused.value = false;

        if (interval.value) clearInterval(interval.value);
        if (iconTimeout.value) clearTimeout(iconTimeout.value);

        setSessionInterval();
        setIconTimeout(iconTimeout, isFrame1Displayed);
    }

    function skipSession() {
        if (interval.value) clearInterval(interval.value);
        if (iconTimeout.value) clearTimeout(iconTimeout.value);

        isFocusPlaying.value = !isFocusPlaying.value;

        if (isFocusPlaying.value) {
            timer.value = [...initFocus];
        } else {
            timer.value = [...initRelax];
        }

        initSessionTime();

        if (isAnimationPaused.value) return;

        setSessionInterval();
        setIconTimeout(iconTimeout, isFrame1Displayed);
    }

    function resetSession() {
        isAnimationPaused.value = true;

        if (interval.value) clearInterval(interval.value);
        if (iconTimeout.value) clearTimeout(iconTimeout.value);

        if (isFocusPlaying.value) {
            timer.value = [...initFocus];
        } else {
            timer.value = [...initRelax];
        }

        initSessionTime();
    }
</script>

<template>
    <div class="pomodoro-section">
        <div class="header">
            <span class="font04 silk01">Pomodoro Timer</span>

            <button
                class="btn-round settings"
                type="button"
                @click="$emit('openSettings')"
            >
                <img
                    src="/images/gear-white-02-16.svg"
                    alt="Gear icon"
                />
            </button>
        </div>

        <div class="content">
            <div class="pomodoro">
                <div
                    :class="['gradient', isFocusPlaying ? 'focus' : 'relax', isAnimationPaused ? 'paused' : '']"
                    :style="{ '--angle': `${gradientAngle}deg` }"
                ></div>
                <div class="icon-container">
                    <img
                        v-if="isFrame1Displayed"
                        src="/images/pomodoro/cow01.svg"
                        alt="Cow icon"
                    />
                    <img
                        v-else
                        src="/images/pomodoro/cow02.svg"
                        alt="Cow icon"
                    />
                </div>
            </div>

            <div class="footer">
                <span class="time font11 micro11">
                    {{ hasHours && timer[0]! > 9 ? `${timer[0]}:` : hasHours && timer[0]! <= 9 ? `0${timer[0]}:` : ""
                    }}{{ timer[1]! > 9 ? timer[1] : `0${timer[1]}` }}:{{ timer[2]! > 9 ? timer[2] : `0${timer[2]}` }}
                </span>

                <span
                    :class="[
                        'status',
                        'font02',
                        'micro02',
                        isAnimationPaused ? '' : isFocusPlaying ? 'focus' : 'relax',
                    ]"
                >
                    {{ isAnimationPaused ? "Paused" : isFocusPlaying ? "Focus" : "Relax" }}
                </span>

                <div class="btn-container">
                    <button
                        :class="['btn-round', isFocusPlaying ? 'focus' : 'relax']"
                        type="button"
                        @click="resetSession()"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 1.33337H6.66669V2.66671H12V1.33337Z" />
                            <path d="M6.66665 2.66675H5.33331V4.00008H6.66665V2.66675Z" />
                            <path d="M14.6667 2.66675V5.33341H13.3333V4.00008H12V2.66675H14.6667Z" />
                            <path
                                d="M5.33331 6.66671V8.00004H3.99998V10.6667H2.66665V8.00004H1.33331V6.66671H2.66665V5.33337H3.99998V6.66671H5.33331Z"
                            />
                            <path d="M16 5.33337H14.6667V10.6667H16V5.33337Z" />
                            <path d="M1.33333 8H0V9.33333H1.33333V8Z" />
                            <path d="M6.66665 8H5.33331V9.33333H6.66665V8Z" />
                            <path d="M6.66667 12.0001V13.3334H4V10.6667H5.33333V12.0001H6.66667Z" />
                            <path d="M14.6667 10.6667V13.3334H12V12.0001H13.3333V10.6667H14.6667Z" />
                            <path d="M12 13.3334H6.66669V14.6667H12V13.3334Z" />
                        </svg>
                    </button>

                    <button
                        :class="['btn-round', isFocusPlaying ? 'focus' : 'relax']"
                        type="button"
                        @click="startSession()"
                    >
                        <svg
                            v-if="isAnimationPaused"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M14 7.33333V8.66667H12.6667V10H10V11.3333H7.33333V12.6667H4.66667V14H2V2H4.66667V3.33333H7.33333V4.66667H10V6H12.6667V7.33333H14Z"
                            />
                        </svg>

                        <svg
                            v-else
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5.99998 2.66663H3.33331V13.3333H5.99998V2.66663Z" />
                            <path d="M12.6667 2.66663H10V13.3333H12.6667V2.66663Z" />
                        </svg>
                    </button>

                    <button
                        :class="['btn-round', isFocusPlaying ? 'focus' : 'relax']"
                        type="button"
                        @click="skipSession()"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.6667 7.33333V8.66667H11.3334V10H8.66669V11.3333H6.00002V12.6667H3.33335V14H0.666687V2H3.33335V3.33333H6.00002V4.66667H8.66669V6H11.3334V7.33333H12.6667Z"
                            />
                            <path d="M15.3333 2H14V14H15.3333V2Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "~/assets/scss/pomodoroSection.scss";
</style>
