export default function setMonth(monthNumber: number, month: Ref<string>) {
    switch (monthNumber) {
        case 0:
            month.value = "January";
            break;
        case 1:
            month.value = "February";
            break;
        case 2:
            month.value = "March";
            break;
        case 3:
            month.value = "April";
            break;
        case 4:
            month.value = "May";
            break;
        case 5:
            month.value = "June";
            break;
        case 6:
            month.value = "July";
            break;
        case 7:
            month.value = "August";
            break;
        case 8:
            month.value = "September";
            break;
        case 9:
            month.value = "October";
            break;
        case 10:
            month.value = "November";
            break;
        case 11:
            month.value = "December";
            break;
        default:
            break;
    }
}
