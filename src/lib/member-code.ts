import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "./prisma";

type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/**
 * Safely generates the next unique member code in the format:
 * GSWO-001, GSWO-002, GSWO-003, ...
 * Finds the highest numeric member code matching GSWO-XXX inside the transaction.
 */
export async function generateNextMemberCode(
  tx?: PrismaTransactionClient | Prisma.TransactionClient
): Promise<string> {
  const db = tx || prisma;

  const allProfiles = await db.memberProfile.findMany({
    where: {
      memberCode: {
        startsWith: "GSWO-",
      },
    },
    select: {
      memberCode: true,
    },
  });

  let maxNum = 0;
  for (const profile of allProfiles) {
    if (!profile.memberCode) continue;
    const match = profile.memberCode.match(/^GSWO-(\d+)$/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = maxNum + 1;
  const padded = String(nextNum).padStart(3, "0");
  return `GSWO-${padded}`;
}
