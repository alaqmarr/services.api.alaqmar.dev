import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: "Missing clientId param" },
      { status: 400 },
    );
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    return NextResponse.json(
      { success: false, message: "Client not found" },
      { status: 404 },
    );
  }

  // Basic authorization - if client exists, they are authorized
  // (Since we removed maintenance mode and billing status checks)
  return NextResponse.json(
    {
      success: true,
      authorized: true,
      client: {
        name: client.name,
        branch: client.domain || "", // mapping domain -> branch for compat (company field removed)
        id: client.id,
      },
    },
    { status: 200 },
  );
}
