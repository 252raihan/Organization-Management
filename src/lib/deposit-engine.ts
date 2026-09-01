import { MONTHLY_DEPOSIT_AMOUNT } from "@/lib/constants";

export interface MonthYear {
  month: number; // 1-12
  year: number;  // e.g. 2026
}

/**
 * Calculates the required monthly periods starting from registrationDate up to the target date (or now).
 * Per RULE 2: Starts from the member's registration month.
 */
export function calculateRequiredMonths(
  registrationDate: Date,
  targetDate: Date = new Date()
): MonthYear[] {
  const regDate = new Date(registrationDate);
  const target = new Date(targetDate);

  let currentYear = regDate.getFullYear();
  let currentMonth = regDate.getMonth() + 1; // 1-12

  const endYear = target.getFullYear();
  const endMonth = target.getMonth() + 1;

  const months: MonthYear[] = [];

  while (
    currentYear < endYear ||
    (currentYear === endYear && currentMonth <= endMonth)
  ) {
    months.push({ month: currentMonth, year: currentYear });
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return months;
}

/**
 * Validates whether an amount is a valid monthly deposit amount.
 * Per RULE 5: Must be positive integer divisible by 100.
 */
export function isValidMonthlyDepositAmount(amount: number): boolean {
  if (!Number.isInteger(amount) || amount <= 0) {
    return false;
  }
  return amount % MONTHLY_DEPOSIT_AMOUNT === 0;
}

/**
 * Calculates the number of monthly units a given amount covers.
 * e.g., 500 => 5 units (months)
 */
export function calculateMonthlyUnits(amount: number): number {
  if (!isValidMonthlyDepositAmount(amount)) {
    throw new Error(`Amount must be a positive multiple of ৳${MONTHLY_DEPOSIT_AMOUNT}`);
  }
  return Math.floor(amount / MONTHLY_DEPOSIT_AMOUNT);
}
