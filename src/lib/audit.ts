import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function logAction(
  action: string,
  entityType?: string, // Renamed from entity to entityType
  entityId?: string,
  details?: string, // Renamed from metadata to details (String)
) {
  try {
    const session = await auth();
    const userId = session?.user?.email || "system";

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType: entityType || "unknown",
        entityId,
        details: details || undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
}
