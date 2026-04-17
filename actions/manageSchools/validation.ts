import { addWeeks, isBefore } from "date-fns";

export function validateActivationKeyExpirationDate(
  now: Date,
  activationKeyExpirationDate: Date,
): string | null {
  if (isBefore(addWeeks(now, 9), activationKeyExpirationDate)) {
    return "Duration of the course is longer than the longest course in your school.";
  }

  if (isBefore(activationKeyExpirationDate, now)) {
    return "The time you enetered is in the past.";
  }

  return null;
}
