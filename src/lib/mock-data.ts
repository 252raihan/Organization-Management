/**
 * ISOLATED MOCK / PLACEHOLDER DATA FOR PHASE 1
 * 
 * IMPORTANT:
 * These are strictly static dummy data designed for UI preview during Phase 1.
 * In Phase 2, all pages and components will query the PostgreSQL database via Prisma.
 */

export interface MockKpiStat {
  title: string;
  value: string;
  change?: string;
  subtitle?: string;
  icon: string;
}

export interface MockMember {
  id: string;
  name: string;
  memberCode: string;
  phone: string;
  bloodGroup: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  totalDeposit: number;
  joinDate: string;
}

export interface MockDeposit {
  id: string;
  memberCode: string;
  memberName: string;
  month: string;
  year: number;
  amount: number;
  status: "PAID" | "PARTIAL" | "DUE";
  paymentDate?: string;
}

export interface MockPayment {
  id: string;
  memberName: string;
  amount: number;
  method: "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER" | "CASH";
  trxId: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  date: string;
}

export interface MockBloodDonor {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  lastDonationDate: string;
  union: string;
  isAvailable: boolean;
}


export const MOCK_HOME_STATS: MockKpiStat[] = [
  {
    title: "মোট নিবন্ধিত সদস্য",
    value: "১২৮ জন",
    subtitle: "ফুলবাড়িয়া ও গোপীনাথপুর এলাকা",
    icon: "Users",
  },
  {
    title: "সংগৃহীত কল্যাণ তহবিল",
    value: "৳ ২,৪৫,০০০",
    subtitle: "মাসিক সঞ্চয় ও অনুদান",
    icon: "Wallet",
  },
  {
    title: "রক্তদান ও সমাজসেবা",
    value: "৪৫০+ ব্যাগ",
    subtitle: "জরুরি রক্ত সরবরাহ",
    icon: "Droplets",
  },
  {
    title: "সহায়তাপ্রাপ্ত পরিবার",
    value: "৬৫+ পরিবার",
    subtitle: "চিকিৎসা ও শিক্ষা সহায়তা",
    icon: "Heart",
  },
];

export const MOCK_ADMIN_STATS: MockKpiStat[] = [
  {
    title: "মোট সক্রিয় সদস্য",
    value: "১১৮",
    change: "+১২ জন এ মাসে",
    subtitle: "অনুমোদিত সদস্যবৃন্দ",
    icon: "Users",
  },
  {
    title: "চলতি মাসের আদায়",
    value: "৳ ৫৪,৫০০",
    change: "৮৮% সম্পন্ন",
    subtitle: "নভেম্বর ২০২৫",
    icon: "Wallet",
  },
  {
    title: "সর্বমোট সঞ্চয় ফান্ড",
    value: "৳ ৩,৮৫,২০০",
    subtitle: "সংগঠনের কেন্দ্রীয় তহবিল",
    icon: "PiggyBank",
  },
  {
    title: "অপেক্ষমাণ ভেরিফিকেশন",
    value: "০৭ টি",
    change: "যাচাই প্রয়োজন",
    subtitle: "নতুন পেমেন্ট ট্রানজেকশন",
    icon: "Clock",
  },
  {
    title: "সক্রিয় রক্তদাতা",
    value: "৮৬ জন",
    subtitle: "জরুরি প্রয়োজনে প্রস্তুত",
    icon: "Droplets",
  },
  {
    title: "মোট ব্যয় ও ত্রাণ",
    value: "৳ ১,২০,০০০",
    subtitle: "কল্যাণমূলক প্রকল্পে ব্যয়",
    icon: "Heart",
  },
];

export const MOCK_MEMBER_STATS: MockKpiStat[] = [
  {
    title: "আমার মোট সঞ্চয়",
    value: "৳ ১২,৫০০",
    subtitle: "২৫ কিস্তির মোট জমা",
    icon: "Wallet",
  },
  {
    title: "চলতি মাসের স্ট্যাটাস",
    value: "পরিশোধিত",
    subtitle: "নভেম্বর ২০২৫ (৳ ৫০০)",
    icon: "CalendarCheck",
  },
  {
    title: "বকেয়া কিস্তি",
    value: "৳ ০.০০",
    subtitle: "কোনো বকেয়া নেই",
    icon: "AlertCircle",
  },
  {
    title: "রক্তদানের পরিসংখ্যান",
    value: "০৩ বার",
    subtitle: "সর্বশেষ: ১৫ আগস্ট ২০২৫",
    icon: "HeartHandshake",
  },
];

export const MOCK_RECENT_PAYMENTS: MockPayment[] = [
  {
    id: "pay-001",
    memberName: "মোঃ তানভীর হাসান",
    amount: 500,
    method: "BKASH",
    trxId: "TRX8829104",
    status: "VERIFIED",
    date: "২০২৫-১১-০১",
  },
  {
    id: "pay-002",
    memberName: "রাকিবুল ইসলাম",
    amount: 1000,
    method: "NAGAD",
    trxId: "NGD9938120",
    status: "PENDING",
    date: "২০২৫-১১-০২",
  },
  {
    id: "pay-003",
    memberName: "জাহিদুল হক",
    amount: 500,
    method: "ROCKET",
    trxId: "RCK7728192",
    status: "VERIFIED",
    date: "২০২৫-১১-০৩",
  },
  {
    id: "pay-004",
    memberName: "মাহমুদ হাসান",
    amount: 1500,
    method: "BANK_TRANSFER",
    trxId: "DBBL554433",
    status: "PENDING",
    date: "২০২৫-১১-০৪",
  },
  {
    id: "pay-005",
    memberName: "ফারুক হোসেন",
    amount: 500,
    method: "BKASH",
    trxId: "BK99482710",
    status: "VERIFIED",
    date: "২০২৫-১১-০৫",
  },
];

export const MOCK_RECENT_MEMBERS: MockMember[] = [
  {
    id: "mem-001",
    name: "তানভীর হাসান",
    memberCode: "MEM-001",
    phone: "01711-000001",
    bloodGroup: "O+",
    status: "ACTIVE",
    totalDeposit: 12500,
    joinDate: "২০২৩-০১-১৫",
  },
  {
    id: "mem-002",
    name: "রাকিবুল ইসলাম",
    memberCode: "MEM-002",
    phone: "01811-000002",
    bloodGroup: "A+",
    status: "ACTIVE",
    totalDeposit: 10000,
    joinDate: "২০২৩-০২-০১",
  },
  {
    id: "mem-003",
    name: "জাহিদুল হক",
    memberCode: "MEM-003",
    phone: "01911-000003",
    bloodGroup: "B+",
    status: "ACTIVE",
    totalDeposit: 11500,
    joinDate: "২০২৩-০২-১৫",
  },
  {
    id: "mem-004",
    name: "মাহমুদ হাসান",
    memberCode: "MEM-004",
    phone: "01611-000004",
    bloodGroup: "AB+",
    status: "PENDING",
    totalDeposit: 500,
    joinDate: "২০২৫-১০-২০",
  },
  {
    id: "mem-005",
    name: "ফারুক হোসেন",
    memberCode: "MEM-005",
    phone: "01511-000005",
    bloodGroup: "O-",
    status: "ACTIVE",
    totalDeposit: 9000,
    joinDate: "২০২৩-০৬-১০",
  },
];

export const MOCK_DEPOSITS: MockDeposit[] = [
  {
    id: "dep-001",
    memberCode: "MEM-001",
    memberName: "তানভীর হাসান",
    month: "নভেম্বর",
    year: 2025,
    amount: 500,
    status: "PAID",
    paymentDate: "২০২৫-১১-০১",
  },
  {
    id: "dep-002",
    memberCode: "MEM-001",
    memberName: "তানভীর হাসান",
    month: "অক্টোবর",
    year: 2025,
    amount: 500,
    status: "PAID",
    paymentDate: "২০২৫-১০-০১",
  },
  {
    id: "dep-003",
    memberCode: "MEM-002",
    memberName: "রাকিবুল ইসলাম",
    month: "নভেম্বর",
    year: 2025,
    amount: 500,
    status: "DUE",
  },
];

export const MOCK_BLOOD_DONORS: MockBloodDonor[] = [
  {
    id: "bd-001",
    name: "তানভীর হাসান",
    phone: "01711-000001",
    bloodGroup: "O+",
    lastDonationDate: "২০২৫-০৮-১৫",
    union: "এনায়েতপুর",
    isAvailable: true,
  },
  {
    id: "bd-002",
    name: "রাকিবুল ইসলাম",
    phone: "01811-000002",
    bloodGroup: "A+",
    lastDonationDate: "২০২৫-০৭-১০",
    union: "এনায়েতপুর",
    isAvailable: true,
  },
  {
    id: "bd-003",
    name: "ফারুক হোসেন",
    phone: "01511-000005",
    bloodGroup: "O-",
    lastDonationDate: "২০২৫-০৫-২০",
    union: "ফুলবাড়িয়া সদর",
    isAvailable: false,
  },
];
