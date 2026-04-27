export const LogInStatus = {
  EMPTY: -1,
  SUCCESS: 0,
  UNVERIFIED: 1,
  WRONG_CREDENTIALS: 2,
  INVALID_SUBSCRIPTION: 3,
} as const;

export type LoginStatus = (typeof LogInStatus)[keyof typeof LogInStatus];
