import moment from "moment";

export const dateToGoogleDatetime = (date: Date): string => {

    const dateMoment = moment(date);

    const yearMonthDay = dateMoment.format("YYYY-MM-DD");
    const hourMinuteSeconds = dateMoment.format("HH:mm:ss");

    return `${yearMonthDay}T${hourMinuteSeconds}Z`;
}