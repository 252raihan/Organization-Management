import { z } from "zod";

export const BLOOD_GROUP_VALUES = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;

export const memberBloodDonorSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUP_VALUES, {
    errorMap: () => ({ message: "সঠিক রক্তের গ্রুপ নির্বাচন করুন" }),
  }),
  isAvailable: z.boolean().default(true),
  lastDonationDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      const d = new Date(val);
      return !isNaN(d.getTime());
    }, {
      message: "সঠিক তারিখ প্রদান করুন",
    }),
  alternatePhone: z
    .string()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .max(255, "ঠিকানা সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে")
    .optional()
    .nullable()
    .or(z.literal("")),
  union: z
    .string()
    .trim()
    .max(100, "ইউনিয়ন সর্বোচ্চ ১০০ অক্ষরের হতে পারে")
    .optional()
    .nullable()
    .or(z.literal("")),
  upazila: z
    .string()
    .trim()
    .max(100, "উপজেলা সর্বোচ্চ ১০০ অক্ষরের হতে পারে")
    .optional()
    .nullable()
    .or(z.literal("")),
  district: z
    .string()
    .trim()
    .max(100, "জেলা সর্বোচ্চ ১০০ অক্ষরের হতে পারে")
    .optional()
    .nullable()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(500, "নোট সর্বোচ্চ ৫০০ অক্ষরের হতে পারে")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type MemberBloodDonorInput = z.infer<typeof memberBloodDonorSchema>;
