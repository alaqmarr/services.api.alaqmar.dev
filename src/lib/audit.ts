import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function logAction(
  action: string,
  entityType?: string,
  entityId?: string,
  details?: any,
) {
  try {
    const session = await auth();
    const userId = session?.user?.email || "system"; // Using email acting as ID for now if ID not available

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error("Failed to log action:", error);
    // measurable failure should not block the main action
  }
}
