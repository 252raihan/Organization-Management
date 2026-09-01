"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";

interface CreateAuditLogParams {
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown> | string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
  } | null;
}

export interface GetAuditLogsParams {
  action?: string;
  limit?: number;
  page?: number;
}

/**
 * Creates an AuditLog entry.
 * Never logs passwords or sensitive credentials.
 */
export async function createAuditLog({
  action,
  entityType,
  entityId,
  details,
}: CreateAuditLogParams) {
  try {
    const user = await getCurrentUser();
    const detailsString =
      typeof details === "object" ? JSON.stringify(details) : details;

    await prisma.auditLog.create({
      data: {
        userId: user?.id || null,
        action,
        entityType,
        entityId: entityId || null,
        details: detailsString || null,
      },
    });
  } catch (error) {
    console.error("[AuditLog Error]", error);
  }
}

/**
 * Retrieves audit logs with pagination and action filtering.
 * Enforces server-side ADMIN authorization.
 * Strictly never exposes sensitive credentials.
 */
export async function getAuditLogs(params?: GetAuditLogsParams): Promise<{
  success: boolean;
  data: AuditLogItem[];
  total: number;
  error?: string;
}> {
  try {
    await requireAdmin();

    const limit = Math.min(Math.max(params?.limit || 20, 1), 100);
    const page = Math.max(params?.page || 1, 1);
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};
    if (params?.action && params.action !== "ALL") {
      where.action = params.action;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          details: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      success: true,
      data: logs,
      total,
    };
  } catch (error) {
    console.error("[getAuditLogs Error]", error);
    return {
      success: false,
      data: [],
      total: 0,
      error: "অডিট লগ লোড করতে সমস্যা হয়েছে।",
    };
  }
}
