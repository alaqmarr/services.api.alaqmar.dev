"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BillingStatus, Prisma } from "@/lib/generated/prisma/client";
import { logAction } from "@/lib/audit";

export type State = {
  errors?: {
    name?: string[];
    domain?: string[];
    billingStatus?: string[];
    planId?: string[];
    billingCycle?: string[];
    startDate?: string[];
    billingPeriod?: string[];
    domainProvider?: string[];
    domainExpiry?: string[];
    email?: string[];
    password?: string[];
    description?: string[];
  };
  message?: string | null;
  success?: boolean;
  client?: any;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  domain: z.string().min(1, "Domain is required"),
  billingStatus: z.enum(["PAID", "UNPAID", "OVERDUE"]),
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().optional(),
  planId: z.string().optional(),
  customPrice: z.string().optional(), // Decimal as string from form
  amountPaid: z.string().optional(), // Decimal as string from form
  renewalPrice: z.string().optional(),
  description: z.string().optional(),
  billingCycle: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  billingPeriod: z.string().optional(), // Units, e.g. "13"
  startDate: z.string().optional(), // Will be parsed to Date
  domainExpiry: z.string().optional(),
  domainProvider: z.string().optional(),
  domainBoughtAt: z.string().optional(),
});

const CreateClient = FormSchema.omit({
  id: true,
  maintenanceMode: true,
  maintenanceMessage: true,
});

const UpdateClient = FormSchema.omit({
  maintenanceMode: true,
  maintenanceMessage: true,
});

export async function createClient(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const validatedFields = CreateClient.safeParse({
    name: formData.get("name"),
    domain: formData.get("domain"),
    billingStatus: formData.get("billingStatus"),
    planId: formData.get("planId"),
    customPrice: formData.get("customPrice"),
    amountPaid: formData.get("amountPaid"),
    renewalPrice: formData.get("renewalPrice"),
    description: formData.get("description"),
    billingCycle: formData.get("billingCycle"),
    billingPeriod: formData.get("billingPeriod"),
    startDate: formData.get("startDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Create Client.",
    };
  }

  const {
    name,
    domain,
    billingStatus,
    planId,
    customPrice,
    amountPaid,
    renewalPrice,
    description,
    billingCycle,
    billingPeriod,
    startDate,
  } = validatedFields.data;

  try {
    const period = parseInt(billingPeriod || "1");
    // const renewalDate = calculateRenewal(new Date(startDate || new Date()), billingCycle as any || 'MONTHLY', period);

    const client = await prisma.client.create({
      data: {
        name,
        domain,
        billingStatus: billingStatus as BillingStatus,
        maintenanceMode: false,
        planId: planId || null,
        customPrice: new Prisma.Decimal(customPrice || 0),
        amountPaid: new Prisma.Decimal(amountPaid || 0),
        renewalPrice: new Prisma.Decimal(renewalPrice || 0),
        description: description || null,
        billingCycle: billingCycle || "MONTHLY",
        billingPeriod: period,
        startDate: startDate ? new Date(startDate) : new Date(),
      },
    });

    await logAction("CREATE_CLIENT", "Client", client.id, {
      name: client.name,
      domain: client.domain,
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Client.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateClient(
  id: string,
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const validatedFields = UpdateClient.safeParse({
    id: id,
    name: formData.get("name"),
    domain: formData.get("domain"),
    billingStatus: formData.get("billingStatus"),
    planId: formData.get("planId"),
    customPrice: formData.get("customPrice"),
    amountPaid: formData.get("amountPaid"),
    renewalPrice: formData.get("renewalPrice"),
    description: formData.get("description"),
    billingCycle: formData.get("billingCycle"),
    billingPeriod: formData.get("billingPeriod"),
    startDate: formData.get("startDate"),
    domainExpiry: formData.get("domainExpiry"),
    domainProvider: formData.get("domainProvider"),
    domainBoughtAt: formData.get("domainBoughtAt"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Update Client.",
    };
  }

  const {
    name,
    domain,
    billingStatus,
    planId,
    customPrice,
    amountPaid,
    renewalPrice,
    description,
    billingCycle,
    billingPeriod,
    startDate,
    domainExpiry,
    domainProvider,
    domainBoughtAt,
  } = validatedFields.data;

  try {
    const period = parseInt(billingPeriod || "1");

    await prisma.client.update({
      where: { id },
      data: {
        name,
        domain,
        billingStatus: billingStatus as BillingStatus,
        planId: planId || null,
        customPrice: new Prisma.Decimal(customPrice || 0),
        amountPaid: new Prisma.Decimal(amountPaid || 0),
        renewalPrice: new Prisma.Decimal(renewalPrice || 0),
        description: description || null,
        billingCycle: billingCycle || "MONTHLY",
        billingPeriod: period,
        startDate: startDate ? new Date(startDate) : undefined,
        domainExpiry: domainExpiry ? new Date(domainExpiry) : undefined,
        domainProvider: domainProvider || null,
        domainBoughtAt: domainBoughtAt ? new Date(domainBoughtAt) : undefined,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Client.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/clients/${id}`);
  return { success: true, message: "Client updated successfully." };
}

export async function addTransaction(
  clientId: string,
  amount: number,
  description: string,
  type: "PAYMENT" | "ADJUSTMENT",
  method: string,
) {
  try {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new Error("Client not found");

    const [transaction, updatedClient] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          clientId,
          amount: new Prisma.Decimal(amount),
          description,
          type,
          method,
        },
      }),
      prisma.client.update({
        where: { id: clientId },
        data: {
          amountPaid: {
            increment: new Prisma.Decimal(amount),
          },
        },
      }),
    ]);

    await logAction("ADD_TRANSACTION", "Transaction", transaction.id, {
      clientId,
      amount,
      type,
    });

    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true, message: "Transaction added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add transaction." };
  }
}

export async function renewClient(id: string) {
  try {
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return { success: false, message: "Client not found" };

    const currentStartDate = new Date(client.startDate);
    let nextStartDate = new Date(currentStartDate);
    const period = client.billingPeriod || 1;

    switch (client.billingCycle) {
      case "YEARLY":
        nextStartDate.setFullYear(nextStartDate.getFullYear() + period);
        break;
      case "MONTHLY":
        nextStartDate.setMonth(nextStartDate.getMonth() + period);
        break;
      case "WEEKLY":
        nextStartDate.setDate(nextStartDate.getDate() + 7 * period);
        break;
      case "DAILY":
        nextStartDate.setDate(nextStartDate.getDate() + period);
        break;
    }

    await prisma.client.update({
      where: { id },
      data: {
        startDate: nextStartDate,
        amountPaid: 0, // Reset paid amount for new cycle
        billingStatus: "UNPAID",
        customPrice: client.renewalPrice, // Update current price to renewal price
      },
    });

    await logAction("CREATE_CLIENT", "Client", client.id, {
      name: client.name,
      domain: client.domain,
    });

    revalidatePath(`/dashboard/clients/${id}`);
    return {
      success: true,
      message: "Client subscription renewed successfully.",
    };
  } catch (error) {
    return { success: false, message: "Failed to renew client." };
  }
}

export async function toggleMaintenance(id: string, currentState: boolean) {
  try {
    await prisma.client.update({
      where: { id },
      data: { maintenanceMode: !currentState },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    return;
  }
}

export async function toggleBlock(id: string, currentState: boolean) {
  try {
    await prisma.client.update({
      where: { id },
      data: { isBlocked: !currentState },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    return;
  }
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    return;
  }
}

export async function setupAdmin(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  // 1. Check if any user exists
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return {
      message: "Setup is already complete. Please login.",
      errors: {},
    };
  }

  // 2. Validate form data
  const validatedFields = z
    .object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      name: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Create Admin.",
    };
  }

  const { email, password, name } = validatedFields.data;

  // 3. Create User
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "Admin",
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Admin.",
    };
  }

  // 4. Redirect to login
  redirect("/login");
}

export async function createUser(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const validatedFields = z
    .object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      name: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Create User.",
    };
  }

  const { email, password, name } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "Admin",
      },
    });
    revalidatePath("/dashboard");
    return {
      success: true,
      message: "User created successfully.",
    };
  } catch (error) {
    return {
      message: "Database Error: Failed to Create User.",
    };
  }
}

export async function createPlan(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const validatedFields = z
    .object({
      name: z.string().min(1, "Name is required"),
      price: z.string().min(1, "Price is required"),
      validity: z.string().min(1, "Validity is required"),
      inclusions: z.string().optional(),
      exclusions: z.string().optional(),
      displayOnPortfolio: z.string().optional(), // Checkbox sends "on" or undefined
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Create Plan.",
    };
  }

  const { name, price, validity, inclusions, exclusions, displayOnPortfolio } =
    validatedFields.data;

  // Split by newline and filter empty strings
  const inclusionList = inclusions
    ? inclusions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const exclusionList = exclusions
    ? exclusions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  try {
    await prisma.plan.create({
      data: {
        name,
        price: new Prisma.Decimal(price),
        validity: parseInt(validity),
        inclusions: inclusionList,
        exclusions: exclusionList,
        displayOnPortfolio: displayOnPortfolio === "on",
        durationUnit: "MONTHLY",
      },
    });
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");
    return { success: true, message: "Plan created successfully." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Plan.",
    };
  }
}

export async function deletePlan(id: string) {
  try {
    await prisma.plan.delete({
      where: { id },
    });
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");
    return { success: true, message: "Plan deleted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to delete plan." };
  }
}
export async function createProject(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const validatedFields = z
    .object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      imageUrl: z.string().optional(),
      siteUrl: z.string().optional(),
      repoUrl: z.string().optional(),
      tags: z.string().optional(), // Comma separated
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Create Project.",
    };
  }

  const { title, description, imageUrl, siteUrl, repoUrl, tags } =
    validatedFields.data;

  const tagList = tags
    ? tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  try {
    await prisma.showcase.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        siteUrl: siteUrl || null,
        repoUrl: repoUrl || null,
        tags: tagList,
      },
    });
    revalidatePath("/dashboard/showcase");
    return { success: true, message: "Project created successfully." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Project.",
    };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.showcase.delete({
      where: { id },
    });
    revalidatePath("/dashboard/showcase");
    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to delete project." };
  }
}
