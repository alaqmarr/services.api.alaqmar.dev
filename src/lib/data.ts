import { prisma } from "@/lib/prisma";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export async function getDashboardStats() {
  // 1. Total Clients
  const totalClients = await prisma.client.count();

  // 2. Active Plans MRR
  // Approximate MRR: Price / Billing Period (in months)
  const clientsWithPlans = await prisma.client.findMany({
    where: { planId: { not: null } },
    include: { plan: true },
  });

  let mrr = 0;
  clientsWithPlans.forEach((client) => {
    if (client.plan) {
      const price =
        Number(client.customPrice) > 0
          ? Number(client.customPrice)
          : Number(client.plan.price);
      let months = 1;
      if (client.billingCycle === "YEARLY") months = 12;
      if (client.billingCycle === "WEEKLY") months = 0.25;

      // Adjust for billing period multiplier
      months = months * (client.billingPeriod || 1);

      mrr += price / months;
    }
  });

  // 3. Outstanding Dues
  // Sum of (customPrice - amountPaid) for all clients where customPrice > amountPaid
  // Note: This is an approximation. A proper ledger system would be better but this works for now.
  const allClients = await prisma.client.findMany();
  let outstanding = 0;
  allClients.forEach((client) => {
    const due = Number(client.customPrice) - Number(client.amountPaid);
    if (due > 0) outstanding += due;
  });

  // 4. Revenue (Total Transactions)
  const transactions = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "PAYMENT" },
  });
  const totalRevenue = Number(transactions._sum.amount) || 0;

  return {
    totalClients,
    mrr: Math.round(mrr),
    outstanding: Math.round(outstanding),
    totalRevenue: Math.round(totalRevenue),
  };
}

export async function getUpcomingRenewals() {
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const clients = await prisma.client.findMany({
    where: {
      OR: [
        {
          // Logic to check if startDate + period < 30 days?
          // This is complex in Prisma without raw SQL.
          // For now, let's just fetch all and filter in JS or use domainExpiry
          domainExpiry: {
            lte: thirtyDaysFromNow,
            gte: today,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      domain: true,
      domainExpiry: true,
      plan: { select: { name: true } },
    },
    take: 5,
  });

  // We also need to check subscription expiry (startDate + billing logic)
  // Fetching clients to check manually
  const activeClients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
      startDate: true,
      billingCycle: true,
      billingPeriod: true,
      domain: true,
    },
  });

  const subscriptionRenewals: any[] = [];

  activeClients.forEach((client) => {
    let nextRenewal = new Date(client.startDate);
    const period = client.billingPeriod || 1;
    if (client.billingCycle === "YEARLY")
      nextRenewal.setFullYear(nextRenewal.getFullYear() + period);
    else if (client.billingCycle === "MONTHLY")
      nextRenewal.setMonth(nextRenewal.getMonth() + period);
    else if (client.billingCycle === "WEEKLY")
      nextRenewal.setDate(nextRenewal.getDate() + 7 * period);

    if (nextRenewal >= today && nextRenewal <= thirtyDaysFromNow) {
      subscriptionRenewals.push({
        id: client.id,
        name: client.name,
        domain: client.domain,
        type: "Subscription",
        date: nextRenewal,
      });
    }
  });

  // Merge and sort
  const allRenewals = [
    ...clients.map((c) => ({ ...c, type: "Domain", date: c.domainExpiry })),
    ...subscriptionRenewals,
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return allRenewals;
}

export async function getClientGrowth() {
  // Group by month created
  // This requires raw query or JS processing
  const months = 6;
  const start = startOfMonth(subMonths(new Date(), months - 1));

  const clients = await prisma.client.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true },
  });

  const growthWrapper: Record<string, number> = {};

  // Initialize months
  for (let i = 0; i < months; i++) {
    const d = subMonths(new Date(), i);
    const key = format(d, "MMM yyyy");
    growthWrapper[key] = 0;
  }

  clients.forEach((client) => {
    const key = format(new Date(client.createdAt), "MMM yyyy");
    if (growthWrapper[key] !== undefined) growthWrapper[key]++;
  });

  // Reverse to show oldest first
  return Object.entries(growthWrapper)
    .reverse()
    .map(([name, count]) => ({ name, count }));
}
