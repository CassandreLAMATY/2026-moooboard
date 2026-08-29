<script setup lang="ts">
const day = ref("Monday");
const dayNumber = ref(1);
const month = ref("January");
const year = ref(2000);
const weekNumber = ref(1);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

function update(date: Date) {
    setWeekDay(date.getDay(), day);
    dayNumber.value = date.getDate();
    setMonth(date.getMonth(), month);
    year.value = date.getFullYear();
    setWeek(date, weekNumber);
    hours.value = date.getHours();
    minutes.value = date.getMinutes();
    seconds.value = date.getSeconds();
}

onMounted(() => {
    update(new Date());

    setInterval(() => {
        update(new Date());
    }, 1000);
});
</script>

<template>
    <div class="date-section">
        <div class="container">
            <span class="day font02 micro02">{{ day }}</span>
            <span class="date font04 silk01">{{ month }} {{ dayNumber }}, {{ year }}</span>
        </div>
        <span class="week font03 micro03">Week {{ weekNumber }}</span>
        <span class="time font06 silk01">
            {{ hours > 9 ? hours : `0${hours}` }}:{{ minutes > 9 ? minutes : `0${minutes}` }}:{{
                seconds > 9 ? seconds : `0${seconds}`
            }}
        </span>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/dateSection.scss";
</style>
