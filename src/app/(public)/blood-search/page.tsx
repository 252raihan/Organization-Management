import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BLOOD_GROUPS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { BloodGroup, Prisma } from "@prisma/client";
import { Droplets, MapPin, Phone, Search } from "lucide-react";

export const dynamic = "force-dynamic";

const RESULT_LIMIT = 50;
const bloodGroupLabels: Record<BloodGroup, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-", B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-", O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

type SearchParams = { bloodGroup?: string; location?: string };

async function getAvailableDonors(searchParams: SearchParams) {
  const where: Prisma.BloodDonorWhereInput = { isAvailable: true };
  const selectedGroup = BLOOD_GROUPS.some((group) => group.value === searchParams.bloodGroup)
    ? (searchParams.bloodGroup as BloodGroup) : undefined;
  const location = searchParams.location?.trim();

  if (selectedGroup) where.bloodGroup = selectedGroup;
  if (location) where.OR = [
    { name: { contains: location, mode: "insensitive" } },
    { address: { contains: location, mode: "insensitive" } },
    { union: { contains: location, mode: "insensitive" } },
    { upazila: { contains: location, mode: "insensitive" } },
    { district: { contains: location, mode: "insensitive" } },
  ];

  return prisma.bloodDonor.findMany({
    where, orderBy: { createdAt: "desc" }, take: RESULT_LIMIT,
    select: { name: true, phone: true, bloodGroup: true, address: true, union: true, upazila: true, district: true, isAvailable: true },
  });
}

export default async function BloodSearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  let donors = null;
  let hasError = false;

  try {
    donors = await getAvailableDonors(params);
  } catch (error) {
    console.error("[BloodSearchPage] Failed to load public donors", error);
    hasError = true;
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-10 font-bengali sm:px-6 lg:px-8">
      <PageHeader heading="রক্তদাতার সন্ধান" subheading="আপনার প্রয়োজনীয় রক্তের গ্রুপ ও এলাকার উপলব্ধ রক্তদাতা খুঁজে নিন" />

      <Card>
        <CardContent className="p-6">
          <form method="get" className="grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
            <label className="space-y-2 text-sm font-medium">
              <span>রক্তের গ্রুপ</span>
              <select name="bloodGroup" defaultValue={params.bloodGroup ?? ""} className="h-10 w-full rounded-md border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">সকল রক্তের গ্রুপ</option>
                {BLOOD_GROUPS.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>এলাকা / জেলা / উপজেলা / ইউনিয়ন</span>
              <span className="flex h-10 items-center gap-2 rounded-md border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input name="location" defaultValue={params.location ?? ""} placeholder="এলাকার নাম লিখুন" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </span>
            </label>
            <Button type="submit"><Search className="mr-2 h-4 w-4" /> খুঁজুন</Button>
          </form>
        </CardContent>
      </Card>

      {hasError ? (
        <EmptyState icon={Droplets} title="তথ্য লোড করা যায়নি" description="রক্তদাতার তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" />
      ) : donors?.length ? (
        <section aria-label="উপলব্ধ রক্তদাতা" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {donors.map((donor) => {
            const area = [donor.district, donor.upazila, donor.union, donor.address].filter(Boolean).join(", ");
            return (
              <Card key={`${donor.name}-${donor.phone}`} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{donor.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{area || "এলাকা উল্লেখ নেই"}</p>
                    </div>
                    <span className="rounded-lg bg-rose-100 px-3 py-2 text-lg font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{bloodGroupLabels[donor.bloodGroup]}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm text-emerald-700 dark:text-emerald-400">● রক্তদানে প্রস্তুত</span>
                    <Button asChild size="sm"><a href={`tel:${donor.phone}`}><Phone className="mr-2 h-4 w-4" /> কল করুন</a></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      ) : (
        <EmptyState icon={Droplets} title="কোনো উপলব্ধ রক্তদাতা পাওয়া যায়নি" description="এই মুহূর্তে আপনার নির্বাচিত রক্তের গ্রুপ ও এলাকায় কোনো উপলব্ধ রক্তদাতা পাওয়া যায়নি। অন্য এলাকা বা রক্তের গ্রুপ দিয়ে চেষ্টা করুন।" />
      )}


    </div>
  );
}
