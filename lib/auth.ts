import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  // NOTE: This is a simplified placeholder for real authentication.
  // In a real app you would integrate NextAuth or custom auth here.
  const email =
    process.env.DEMO_USER_EMAIL ?? "employee@example.com";

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Demo Employee",
      role: UserRole.USER,
      departmentId: "DEMO"
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export function assertAdmin(user: SessionUser | null): asserts user is SessionUser & { role: UserRole.ADMIN } {
  if (!user || user.role !== UserRole.ADMIN) {
    throw new Prisma.PrismaClientKnownRequestError("FORBIDDEN", {
      code: "P0001",
      clientVersion: "unknown"
    });
  }
}

