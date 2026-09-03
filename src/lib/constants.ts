export const APP_CONFIG = {
  name: "গোপীনাথপুর সমাজ কল্যাণ সংগঠন",
  shortName: "GSWO",
  englishName: "Gopinathpur Social Welfare Organization",
  address: "এনায়েতপুর, ফুলবাড়িয়া, ময়মনসিংহ, বাংলাদেশ",
  phone: "+880 1700-000000",
  email: "info@gopinathpur-sw.org",
  whatsappGroupUrl: "#",
  messengerGroupUrl: "#",
  establishedYear: 2024,
  description:
    "একটি অরাজনৈতিক, অলাভজনক ও সামাজিক সেবামূলক প্রতিষ্ঠান। এলাকার সুবিধাবঞ্চিত মানুষের পাশে দাঁড়ানো এবং সামাজিক উন্নয়নে আমরা অঙ্গীকারবদ্ধ।",
};

/**
 * Central source of truth for the shared organization address used in member registration.
 * Keep union and ward empty until the organization confirms their exact values.
 */
export const ORGANIZATION_ADDRESS = {
  village: "গোপীনাথপুর",
  union: "",
  ward: "",
  upazila: "ফুলবাড়িয়া",
  district: "ময়মনসিংহ",
} as const;

/**
 * Locked business constant: Required monthly contribution per member (৳100).
 */
export const MONTHLY_DEPOSIT_AMOUNT = 100;

export const BLOOD_GROUPS = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
] as const;

export const PAYMENT_METHODS = [
  { label: "বিকাশ (bKash)", value: "BKASH" },
  { label: "নগদ (Nagad)", value: "NAGAD" },
  { label: "রকেট (Rocket)", value: "ROCKET" },
  { label: "ব্যাংক ট্রান্সফার (Bank)", value: "BANK_TRANSFER" },
  { label: "নগদ গ্রহণ (Cash)", value: "CASH" },
] as const;

export const BENGALI_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
] as const;

export const MEMBER_NAV_ITEMS = [
  { title: "ওভারভিউ", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "আমার প্রোফাইল", href: "/dashboard/profile", icon: "User" },
  { title: "মাসিক জমা", href: "/dashboard/deposits", icon: "Wallet" },
  { title: "পেমেন্ট হিস্ট্রি", href: "/dashboard/payments", icon: "Receipt" },
  { title: "অনুদান", href: "/dashboard/donations", icon: "Heart" },
  { title: "রক্তদান", href: "/dashboard/blood", icon: "Droplets" },
  { title: "সেটিংস", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { title: "ওভারভিউ", href: "/admin", icon: "LayoutDashboard" },
  { title: "সদস্য তালিকা", href: "/admin/members", icon: "Users" },
  { title: "মাসিক জমা", href: "/admin/deposits", icon: "Wallet" },
  { title: "পেমেন্টস", href: "/admin/payments", icon: "Receipt" },
  { title: "অনুদান", href: "/admin/donations", icon: "Heart" },
  { title: "রক্তদাতা তালিকা", href: "/admin/blood-donors", icon: "Droplets" },
  { title: "গ্যালারি", href: "/admin/gallery", icon: "Image" },
  { title: "রিপোর্টস", href: "/admin/reports", icon: "BarChart3" },
  { title: "সেটিংস", href: "/admin/settings", icon: "Settings" },
  { title: "অডিট লগ", href: "/admin/audit-logs", icon: "FileText" },
] as const;
