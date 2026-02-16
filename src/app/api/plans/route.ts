import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        displayOnPortfolio: true,
      },
      orderBy: {
        createdAt: "desc", // Changed from sortOrder to createdAt
      },
    });

    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch plans" },
      { status: 500 },
    );
  }
}
