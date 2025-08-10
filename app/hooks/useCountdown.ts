import { useState, useEffect, useRef } from "react";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Use ref to store the target date to avoid dependency issues
  const targetDateRef = useRef(targetDate);
  targetDateRef.current = targetDate;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const thailandTimezone = "Asia/Bangkok";

      // Get current time in Thailand timezone
      const nowUtc = new Date();
      const nowInThailand = toZonedTime(nowUtc, thailandTimezone);

      // Convert target date to Thailand timezone for comparison
      const targetInThailand = toZonedTime(
        targetDateRef.current,
        thailandTimezone
      );

      const totalSeconds = differenceInSeconds(targetInThailand, nowInThailand);

      if (totalSeconds > 0) {
        const days = differenceInDays(targetInThailand, nowInThailand);
        const hours = differenceInHours(targetInThailand, nowInThailand) % 24;
        const minutes =
          differenceInMinutes(targetInThailand, nowInThailand) % 60;
        const seconds = totalSeconds % 60;

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Set up interval
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array since we use ref

  return timeLeft;
}
