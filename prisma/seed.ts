import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Seed script to create initial admin user securely using environment variables.
 * Run with: npx tsx prisma/seed.ts (or npm run prisma:seed)
 */
async function main() {
  const adminPhone = process.env.INITIAL_ADMIN_PHONE || "01700000000";
  const adminName = process.env.INITIAL_ADMIN_NAME || "প্রধান প্রশাসক";
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@gopinathpur-sw.org";
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@GSWO2025!";

  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [{ phone: adminPhone }, { email: adminEmail }, { role: "ADMIN" }],
    },
  });

  if (existingAdmin) {
    console.log(`[Seed] Admin already exists: ${existingAdmin.phone} (${existingAdmin.role})`);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      name: adminName,
      phone: adminPhone,
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      isActive: true,
      profile: {
        create: {
          memberCode: "GSWO-ADMIN",
          status: "ACTIVE",
          presentAddress: "ফুলবাড়িয়া, ময়মনসিংহ",
          permanentAddress: "এনায়েতপুর, ফুলবাড়িয়া, ময়মনসিংহ",
          registrationDate: new Date(),
        },
      },
    },
  });

  console.log(`[Seed] Successfully seeded initial admin: ${admin.name} (${admin.phone})`);
}

main()
  .catch((e) => {
    console.error("[Seed Error]", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
