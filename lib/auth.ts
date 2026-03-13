import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function getCurrentUser(request?: Request): Promise<SessionUser | null> {
  // NOTE: This is a simplified placeholder for real authentication.
  // In a real app you would integrate NextAuth or custom auth here.
  
  // Check for demo role header
  let email = process.env.DEMO_USER_EMAIL ?? "employee@example.com";
  let role: UserRole = UserRole.USER;
  
  if (request) {
    const headerRole = request.headers.get("x-demo-role");
    if (headerRole === "ADMIN") {
      email = "admin@example.com";
      role = UserRole.ADMIN;
    }
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: role === UserRole.ADMIN ? "ผู้ดูแลระบบ" : "พนักงานทดสอบ",
      role,
      departmentId: role === UserRole.ADMIN ? "ADMIN" : "IT"
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export function assertAdmin(
  user: SessionUser | null
): asserts user is SessionUser & { role: "ADMIN" } {
  if (!user || user.role !== UserRole.ADMIN) {
    throw new Prisma.PrismaClientKnownRequestError("FORBIDDEN", {
      code: "P0001",
      clientVersion: "unknown"
    });
  }
}

