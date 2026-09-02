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
 * Per CASH rule:
 * - Digital methods (BKASH, NAGAD, ROCKET, BANK_TRANSFER) require a transactionId.
 * - CASH does not require transactionId.
 */
export const monthlyDepositPaymentSchema = z
  .object({
    amount: monthlyDepositAmountSchema,
    paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "CASH"], {
      errorMap: () => ({ message: "পেমেন্ট মাধ্যম নির্বাচন করুন" }),
    }),
    paymentType: z
      .enum(["MONTHLY_DEPOSIT", "ADVANCE_DEPOSIT"])
      .default("MONTHLY_DEPOSIT"),
    transactionId: z.string().trim().optional().or(z.literal("")),
    accountNumber: z.string().trim().optional().or(z.literal("")),
    notes: z.string().trim().max(500, "নোট সর্বোচ্চ ৫০০ অক্ষরের হতে পারে").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod !== "CASH") {
      if (!data.transactionId || data.transactionId.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ডিজিটাল পেমেন্টের জন্য ট্রানজেকশন আইডি (TrxID) বাধ্যতামূলক (কমপক্ষে ৩ অক্ষর)",
          path: ["transactionId"],
        });
      }
    }
  });

export type MonthlyDepositAmountInput = z.infer<typeof monthlyDepositAmountSchema>;
export type MonthlyDepositPaymentInput = z.infer<typeof monthlyDepositPaymentSchema>;
