export type { Role, MemberStatus, DepositStatus, PaymentType, PaymentMethod, PaymentStatus, BloodGroup, DonationType } from "@prisma/client";
import type { Role } from "@prisma/client";

export interface SessionUser {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  role: Role;
  memberCode?: string | null;
  status?: string | null;
}

export interface AuthSession {
  user: SessionUser | null;
  isAuthenticated: boolean;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
