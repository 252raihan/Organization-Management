import { z } from "zod";
import { MONTHLY_DEPOSIT_AMOUNT } from "@/lib/constants";

/**
 * Zod schema for validating monthly deposit amount.
 * Rules:
 * - amount required
 * - positive integer (> 0)
 * - divisible by 100 (amount % MONTHLY_DEPOSIT_AMOUNT === 0)
 * - no partial payments (e.g. 150 is rejected)
 */
export const monthlyDepositAmountSchema = z
  .number({
    required_error: "জমার পরিমাণ উল্লেখ করুন",
    invalid_type_error: "জমার পরিমাণ সঠিক সংখ্যায় দিন",
  })
  .int("জমার পরিমাণ পূর্ণসংখ্যা হতে হবে")
  .positive("জমার পরিমাণ অবশ্যই ধনাত্মক হতে হবে")
  .refine((val) => val % MONTHLY_DEPOSIT_AMOUNT === 0, {
    message: `জমার পরিমাণ অবশ্যই ৳${MONTHLY_DEPOSIT_AMOUNT} এর গুণিতক হতে হবে (যেমন: ৳১০০, ৳২০০, ৳৫০০, ৳১০০০)`,
  });

/**
 * Schema for monthly deposit submission / payment.
 */
export const monthlyDepositPaymentSchema = z.object({
  amount: monthlyDepositAmountSchema,
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "CASH"], {
    errorMap: () => ({ message: "পেমেন্ট মাধ্যম নির্বাচন করুন" }),
  }),
  transactionId: z.string().trim().min(3, "সঠিক ট্রানজেকশন আইডি দিন"),
  accountNumber: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().max(500, "নোট সর্বোচ্চ ৫০০ অক্ষরের হতে পারে").optional().or(z.literal("")),
});

export type MonthlyDepositAmountInput = z.infer<typeof monthlyDepositAmountSchema>;
export type MonthlyDepositPaymentInput = z.infer<typeof monthlyDepositPaymentSchema>;
