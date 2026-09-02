import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "মোবাইল নম্বর বা ইমেইল দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
  callbackUrl: z.string().optional(),
});

export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.trim().replace(/[\s-]/g, "");
  if (cleaned.startsWith("+88")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.startsWith("88") && cleaned.length === 13) {
    cleaned = cleaned.slice(2);
  }
  return cleaned;
}

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "নাম কমপক্ষে ৩ অক্ষরের হতে হবে")
      .max(100, "নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে"),
    phone: z
      .string()
      .trim()
      .transform(normalizePhoneNumber)
      .refine((val) => /^01[3-9]\d{8}$/.test(val), {
        message: "সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)",
      }),
    email: z
      .string()
      .trim()
      .email("সঠিক ইমেইল দিন")
      .optional()
      .or(z.literal("")),
    bloodGroup: z.enum(
      [
        "A_POSITIVE",
        "A_NEGATIVE",
        "B_POSITIVE",
        "B_NEGATIVE",
        "AB_POSITIVE",
        "AB_NEGATIVE",
        "O_POSITIVE",
        "O_NEGATIVE",
      ],
      {
        errorMap: () => ({ message: "রক্তের গ্রুপ নির্বাচন করুন" }),
      }
    ),
    presentAddress: z
      .string()
      .trim()
      .min(3, "বর্তমান ঠিকানা কমপক্ষে ৩ অক্ষরের হতে হবে")
      .max(255, "বর্তমান ঠিকানা সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে"),
    permanentAddress: z
      .string()
      .trim()
      .max(255, "স্থায়ী ঠিকানা সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে")
      .optional()
      .or(z.literal("")),
    fatherName: z
      .string()
      .trim()
      .max(100, "পিতার নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে")
      .optional()
      .or(z.literal("")),
    motherName: z
      .string()
      .trim()
      .max(100, "মাতার নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে")
      .optional()
      .or(z.literal("")),
    guardianPhone: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),
    dateOfBirth: z
      .string()
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
      .max(100, "পাসওয়ার্ড সর্বোচ্চ ১০০ অক্ষরের হতে পারে"),
    confirmPassword: z
      .string()
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.confirmPassword && data.confirmPassword !== "") {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না",
      path: ["confirmPassword"],
    }
  );

export const paymentSchema = z.object({
  amount: z.number().positive("সঠিক জমার পরিমাণ উল্লেখ করুন"),
  paymentType: z.enum(["MONTHLY_DEPOSIT", "ADVANCE_DEPOSIT", "DONATION", "OTHER"]),
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "CASH"]),
  transactionId: z.string().min(5, "ট্রানজেকশন আইডি দিন"),
  accountNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const donationSchema = z.object({
  donorName: z.string().min(2, "দাতার নাম লিখুন"),
  donorPhone: z.string().optional(),
  donorEmail: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  amount: z.number().positive("সঠিক অনুদানের পরিমাণ উল্লেখ করুন"),
  donationType: z.enum(["GENERAL", "EVENT", "EMERGENCY", "EDUCATION", "HEALTHCARE"]),
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER", "CASH"]),
  transactionId: z.string().optional(),
  purpose: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export const bloodDonorSchema = z.object({
  name: z.string().min(3, "রক্তদাতার নাম লিখুন"),
  phone: z.string().min(11, "মোবাইল নম্বর দিন"),
  bloodGroup: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
  ]),
  union: z.string().default("এনায়েতপুর"),
  upazila: z.string().default("ফুলবাড়িয়া"),
  district: z.string().default("ময়মনসিংহ"),
  lastDonationDate: z.date().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type DonationInput = z.infer<typeof donationSchema>;
export type BloodDonorInput = z.infer<typeof bloodDonorSchema>;
