import { windowsToIana } from "@mikazuki/tz-convert";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { findTimeZone, getUnixTime, getZonedTime } from "timezone-support";

dayjs.extend(utc);

type Time = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds?: number;
  milliseconds?: number;
  dayOfWeek?: number;
  epoch?: number;
  zone?: {
    abbreviation?: string;
    offset: number;
  };
};

function toUnixTime(time: Time): number {
  return Date.UTC(time.year, time.month - 1, time.day, time.hours, time.minutes, time.seconds, time.milliseconds) + time.zone.offset * 60000;
}

function compare(a: Time, b: Time, method: "<=" | "<"): boolean {
  if (method === "<=") {
    return toUnixTime(a) <= toUnixTime(b);
    // return a.year <= b.year && a.month <= b.month && a.day <= b.day && a.hours <= b.hours && a.minutes <= b.minutes && a.seconds <= b.seconds && a.milliseconds <= b.milliseconds;
  }

  return toUnixTime(a) < toUnixTime(b);
  // return a.year < b.year && a.month < b.month && a.day < b.day && a.hours < b.hours && a.minutes < b.minutes && a.seconds < b.seconds && a.milliseconds < b.milliseconds;
}

export function isYesterday(str: string, timezone: string = null): boolean {
  const tzInfo = findTimeZone(windowsToIana(timezone));
  const dt = getZonedTime(
    dayjs(str)
      .utc()
      .toDate(),
    tzInfo
  );

  const startOfToday = Object.assign(
    getZonedTime(
      dayjs()
        .utc()
        .toDate(),
      tzInfo
    ),
    { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
  );

  return compare({ ...startOfToday, day: startOfToday.day - 1 }, dt, "<=") && compare(dt, startOfToday, "<");
}

export function isTooPast(str: string, timezone: string = null): boolean {
  const tzInfo = findTimeZone(windowsToIana(timezone));
  const dt = getZonedTime(
    dayjs(str)
      .utc()
      .toDate(),
    tzInfo
  );
  const startOfToday = Object.assign(
    getZonedTime(
      dayjs()
        .utc()
        .toDate(),
      tzInfo
    ),
    { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
  );

  return compare(dt, { ...startOfToday, day: startOfToday.day - 1 }, "<");
}
