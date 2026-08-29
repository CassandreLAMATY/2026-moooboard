export default function setWeek(date: Date, weekNumber: Ref<number>) {
    const initDate = new Date(date.getFullYear(), 0, 1);

    const initDateMilliseconds = initDate.getTime();
    const dateMilliseconds = date.getTime();

    const milliseconds = dateMilliseconds - initDateMilliseconds;

    const daysPassed = Math.ceil(milliseconds / 86400000);

    weekNumber.value = Math.ceil(daysPassed / 7);
}
