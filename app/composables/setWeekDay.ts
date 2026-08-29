export default function setWeekDay(weekDay: number, day: Ref<string>) {
    switch (weekDay) {
        case 0:
            day.value = "Sunday";
            break;
        case 1:
            day.value = "Monday";
            break;
        case 2:
            day.value = "Tuesday";
            break;
        case 3:
            day.value = "Wednesday";
            break;
        case 4:
            day.value = "Thursday";
            break;
        case 5:
            day.value = "Friday";
            break;
        case 6:
            day.value = "Saturday";
            break;
        default:
            break;
    }
}
