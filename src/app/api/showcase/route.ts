import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.showcase.findMany({
      orderBy: {
        sortOrder: "asc",
      },
      // You can filter by isFeatured if needed, but usually portfolio shows all projects
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
