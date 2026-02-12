import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorCodes, ErrorCodeKey } from "@/lib/error_codes";

function createErrorResponse(code: ErrorCodeKey, extraDetails?: string) {
  const error = errorCodes.errors[code];
  return NextResponse.json(
    {
      success: false,
      code,
      message: error.message,
      description: error.description,
      details: extraDetails,
    },
    { status: error.httpStatus },
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const apiKeyHeader = req.headers.get("x-api-key");

    // 1. Validation: Need at least one identifier
    if (!clientId && !apiKeyHeader) {
      return createErrorResponse(
        "AUTH_001",
        "Missing clientId param or x-api-key header",
      );
    }

    // 2. Lookup Client
    // Priority: API Key > Client ID (though typically API key is secret, clientId is public)
    // If usage is from middleware, it might send both or just one.
    // Let's assume for now we look up by whatever is provided.

    const whereClause = apiKeyHeader
      ? { apiKey: apiKeyHeader }
      : { id: clientId! };

    const client = await prisma.client.findUnique({
      where: whereClause,
      select: {
        id: true,
        name: true,
        billingStatus: true,
        maintenanceMode: true,
        maintenanceMessage: true,
      },
    });

    if (!client) {
      return createErrorResponse("AUTH_002");
    }

    // 3. Maintenance Check
    if (client.maintenanceMode) {
      const error = errorCodes.errors.AUTH_004;
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          code: "AUTH_004",
          message: client.maintenanceMessage || error.message,
          redirectUrl: "/maintenance", // The client middleware should handle this path relative to their site or ours
        },
        { status: error.httpStatus },
      );
    }

    // 4. Billing Check
    if (client.billingStatus !== "PAID") {
      // Could differentiate OVERDUE vs UNPAID if needed, keeping it simple for now
      return createErrorResponse("AUTH_003", `Status: ${client.billingStatus}`);
    }

    // 5. Success
    return NextResponse.json(
      {
        success: true,
        authorized: true,
        client: {
          name: client.name,
          id: client.id,
        },
        code: "OK_001",
        message: errorCodes.success.OK_001.message,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Authorization API Error:", error);
    return createErrorResponse("SYS_001");
  }
}
