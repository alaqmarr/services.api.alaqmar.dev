import { prisma } from "@/lib/prisma";
import { format, subMonths, addDays } from "date-fns";
import { unstable_noStore as noStore } from "next/cache";

export async function getDashboardStats() {
  noStore();
  const totalClients = await prisma.client.count();

  const paidClients = await prisma.client.count({
    where: { billingStatus: "PAID" },
  });

  const unpaidClients = await prisma.client.count({
    where: { billingStatus: "UNPAID" },
  });

  const overdueClients = await prisma.client.count({
    where: { billingStatus: "OVERDUE" },
  });

  const transactions = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "PAYMENT" },
  });
  const totalRevenue = Number(transactions._sum.amount) || 0;

  const pendingAmount = 0;

  const totalTransactions = await prisma.transaction.count();

  return {
    totalClients,
    paidClients,
    unpaidClients,
    overdueClients,
    totalRevenue: Math.round(totalRevenue),
    pendingAmount,
    totalTransactions,
  };
}

export async function getRecentTransactions() {
  noStore();
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true, email: true } } },
    take: 5,
  });
  return transactions;
}

export async function getUpcomingRenewals() {
  noStore();
  const thirtyDaysFromNow = addDays(new Date(), 30);
  const now = new Date();

  const clientsWithDomainExpiry = await prisma.client.findMany({
    where: {
      domainExpiry: {
        gte: now,
        lte: thirtyDaysFromNow,
      },
    },
    select: { id: true, name: true, domainExpiry: true },
  });

  // We can also calculate plan renewals if we had nextBillingDate stored.
  // For now, let's just return domain renewals.

  const renewals = clientsWithDomainExpiry.map((client) => ({
    id: client.id,
    name: client.name,
    type: "Domain",
    date: client.domainExpiry,
  }));

  return renewals.sort(
    (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime(),
  );
}

export async function getClientGrowth() {
  noStore();
  const months = 6;
  const start = subMonths(new Date(), months - 1);

  const clients = await prisma.client.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true },
  });

  const growthWrapper: Record<string, number> = {};

  for (let i = 0; i < months; i++) {
    const d = subMonths(new Date(), i);
    const key = format(d, "MMM yyyy");
    growthWrapper[key] = 0;
  }

  clients.forEach((client) => {
    const key = format(new Date(client.createdAt), "MMM yyyy");
    if (growthWrapper[key] !== undefined) growthWrapper[key]++;
  });

  return Object.entries(growthWrapper)
    .reverse()
    .map(([name, count]) => ({ name, count }));
}
