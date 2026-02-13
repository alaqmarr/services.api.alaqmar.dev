import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow running without auth in dev if needed, or better, secure it.
    // For now, let's just log a warning if secret is missing in env but still run if in dev
    if (
      process.env.NODE_ENV === "production" &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
  }

  try {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // Find active clients
    const clients = await prisma.client.findMany({
      where: {
        billingStatus: { not: "UNPAID" }, // Only notify those who are paid up to date? Or all?
        email: { not: null },
      },
    });

    const renewalsToSend = [];

    for (const client of clients) {
      let nextRenewal = new Date(client.startDate);
      const period = client.billingPeriod || 1;

      if (client.billingCycle === "YEARLY")
        nextRenewal.setFullYear(nextRenewal.getFullYear() + period);
      else if (client.billingCycle === "MONTHLY")
        nextRenewal.setMonth(nextRenewal.getMonth() + period);
      else if (client.billingCycle === "WEEKLY")
        nextRenewal.setDate(nextRenewal.getDate() + 7 * period);
      else if (client.billingCycle === "DAILY")
        nextRenewal.setDate(nextRenewal.getDate() + period);

      // Check if renewal is within the next 7 days (and hasn't passed more than 1 day ago to avoid spamming old ones)
      const diffTime = nextRenewal.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7 && diffDays >= 0) {
        renewalsToSend.push({ client, date: nextRenewal, days: diffDays });
      }
    }

    console.log(`Found ${renewalsToSend.length} renewals coming up.`);

    for (const item of renewalsToSend) {
      if (item.client.email) {
        await sendEmail({
          to: item.client.email,
          subject: `Renewal Reminder - Alaqmar Services`,
          html: `
                        <h1>Renewal Upcoming</h1>
                        <p>Hello ${item.client.name},</p>
                        <p>Your subscription for <strong>${item.client.domain}</strong> is expiring in <strong>${item.days} days</strong> (on ${item.date.toDateString()}).</p>
                        <p>Please log in to your portal to renew: <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/${item.client.id}">Client Portal</a></p>
                    `,
        });
      }
    }

    return NextResponse.json({ success: true, count: renewalsToSend.length });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
