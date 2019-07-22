import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function calcTimeDifference(diff: string = null): number {
  if (!diff) diff = process.env.SPARK_TIME_DIFFERENCE;

  const matches = diff.match(/([+-])(\w{2})(\w{2})/);
  if (matches.length != 4) throw new Error("Invalid Format");

  return (matches[1] === "+" ? 1 : -1) * (parseInt(matches[2]) + parseInt(matches[3]) / 60);
}

export function isYesterday(str: string, diff: string = null): boolean {
  const tz = calcTimeDifference(diff);
  const day = dayjs(str)
    .utc() // Azure Functions is always UTC
    .add(tz, "hour");
  const today = dayjs()
    .utc() // Azure Functions is always UTC
    .add(tz, "hour")
    .startOf("date");

  return today.subtract(1, "day") <= day && day < today;
}

export function isTooPast(str: string, diff: string = null): boolean {
  const tz = calcTimeDifference(diff);
  const day = dayjs(str)
    .utc() // Azure Functions is always UTC
    .add(tz, "hour");
  const yesterday = dayjs()
    .utc() // Azure Functions is always UTC
    .add(tz, "hour")
    .startOf("date")
    .subtract(1, "day");

  return day < yesterday;
}
