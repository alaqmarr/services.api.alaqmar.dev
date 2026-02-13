"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma, BillingStatus } from "@/lib/generated/prisma/client";
import { logAction } from "@/lib/audit";
import { sendEmail } from "@/lib/email";

export type State = {
  errors?: {
    [key: string]: string[];
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

// --- Client Actions ---

const ClientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  domain: z.string().optional().or(z.literal("")),
  billingStatus: z.nativeEnum(BillingStatus).optional(),
  planId: z.string().optional(),
  billingCycle: z.string().optional(),
  subscriptionPeriod: z.string().optional(),
  customPrice: z.string().optional(),
  renewalPrice: z.string().optional(),
  domainExpiry: z.string().optional(),
  domainBoughtAt: z.string().optional(),
  domainProvider: z.string().optional(),
});

const CreateClient = ClientSchema.omit({ id: true });
const UpdateClient = ClientSchema;

export async function createClient(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const validatedFields = CreateClient.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    domain: formData.get("domain"),
    billingStatus: formData.get("billingStatus"),
    planId: formData.get("planId"),
    billingCycle: formData.get("billingCycle"),
    subscriptionPeriod: formData.get("subscriptionPeriod"),
    customPrice: formData.get("customPrice"),
    renewalPrice: formData.get("renewalPrice"),
    domainExpiry: formData.get("domainExpiry"),
    domainBoughtAt: formData.get("domainBoughtAt"),
    domainProvider: formData.get("domainProvider"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Create Client.",
    };
  }

  const {
    name,
    email,
    domain,
    billingStatus,
    planId,
    billingCycle,
    subscriptionPeriod,
    customPrice,
    renewalPrice,
    domainExpiry,
    domainBoughtAt,
    domainProvider,
  } = validatedFields.data;

  try {
    const apiKey =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const client = await prisma.client.create({
      data: {
        name,
        email: email || null,
        domain: domain || "",
        billingStatus: (billingStatus as BillingStatus) || "UNPAID",
        planId: planId || null,
        billingCycle: billingCycle || "MONTHLY",
        billingPeriod: subscriptionPeriod ? parseInt(subscriptionPeriod) : 1,
        customPrice: customPrice ? new Prisma.Decimal(customPrice) : 0,
        renewalPrice: renewalPrice ? new Prisma.Decimal(renewalPrice) : 0,
        apiKey,
        domainExpiry: domainExpiry ? new Date(domainExpiry) : null,
        domainBoughtAt: domainBoughtAt ? new Date(domainBoughtAt) : null,
        domainProvider: domainProvider || null,
      },
    });

    await logAction(
      "CREATE_CLIENT",
      "Client",
      client.id,
      JSON.stringify({ name: client.name }),
    );

    if (client.email) {
      await sendEmail({
        to: client.email,
        subject: "Welcome to Alaqmar Services",
        html: `<h1>Welcome ${client.name}!</h1><p>Your account has been created.</p>`,
      });
    }
  } catch (error) {
    console.error(error);
    return {
      message:
        "Database Error: Failed to Create Client. Domain might be duplicate.",
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
    id,
    name: formData.get("name"),
    email: formData.get("email"),
    domain: formData.get("domain"),
    billingStatus: formData.get("billingStatus"),
    planId: formData.get("planId"),
    billingCycle: formData.get("billingCycle"),
    subscriptionPeriod: formData.get("subscriptionPeriod"),
    customPrice: formData.get("customPrice"),
    renewalPrice: formData.get("renewalPrice"),
    domainExpiry: formData.get("domainExpiry"),
    domainBoughtAt: formData.get("domainBoughtAt"),
    domainProvider: formData.get("domainProvider"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Update Client.",
    };
  }

  const {
    name,
    email,
    domain,
    billingStatus,
    planId,
    billingCycle,
    subscriptionPeriod,
    customPrice,
    renewalPrice,
    domainExpiry,
    domainBoughtAt,
    domainProvider,
  } = validatedFields.data;

  try {
    await prisma.client.update({
      where: { id },
      data: {
        name,
        email: email || null,
        domain: domain || undefined,
        billingStatus: billingStatus as BillingStatus,
        planId: planId || null,
        billingCycle: billingCycle,
        billingPeriod: subscriptionPeriod
          ? parseInt(subscriptionPeriod)
          : undefined,
        customPrice: customPrice ? new Prisma.Decimal(customPrice) : undefined,
        renewalPrice: renewalPrice
          ? new Prisma.Decimal(renewalPrice)
          : undefined,
        domainExpiry: domainExpiry ? new Date(domainExpiry) : undefined,
        domainBoughtAt: domainBoughtAt ? new Date(domainBoughtAt) : undefined,
        domainProvider: domainProvider || undefined,
      },
    });
  } catch (error) {
    return { message: "Database Error: Failed to Update Client." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/clients/${id}`);
  return { success: true, message: "Client updated successfully." };
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({ where: { id } });
    await logAction("DELETE_CLIENT", "Client", id, "");
    revalidatePath("/dashboard");
  } catch (error) {
    return;
  }
}

// --- Transaction Actions ---

export async function addTransaction(
  clientId: string,
  amount: number,
  type: string = "PAYMENT",
  description: string = "",
) {
  try {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new Error("Client not found");

    const transaction = await prisma.transaction.create({
      data: {
        clientId,
        amount: new Prisma.Decimal(amount),
        type: type === "ADJUSTMENT" ? "ADJUSTMENT" : "PAYMENT",
        description,
      },
    });

    await logAction(
      "ADD_TRANSACTION",
      "Transaction",
      transaction.id,
      JSON.stringify({ clientId, amount, type }),
    );

    if (client.email && type === "PAYMENT") {
      await sendEmail({
        to: client.email,
        subject: "Payment Receipt - Alaqmar Services",
        html: `<h1>Payment Recorded</h1><p>Amount: <strong>₹${amount}</strong></p><p>Type: ${type}</p><p>Transaction ID: ${transaction.id}</p>`,
      });
    }

    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true, message: "Transaction added successfully." };
  } catch (error) {
    return { success: false, message: "Failed to add transaction." };
  }
}

// --- User Actions --- (Restored)

export async function setupAdmin(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return { message: "Setup is already complete. Please login.", errors: {} };
  }

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

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword, name: name || "Admin" },
    });
  } catch (error) {
    return { message: "Database Error: Failed to Create Admin." };
  }

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
      data: { email, password: hashedPassword, name: name || "Admin" },
    });
    revalidatePath("/dashboard");
    return { success: true, message: "User created successfully." };
  } catch (error) {
    return { message: "Database Error: Failed to Create User." };
  }
}

// --- Plan Actions ---

export async function createPlan(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const validatedFields = z
    .object({
      name: z.string().min(1, "Name is required"),
      price: z.string().min(1, "Price is required"),
      validity: z.string().min(1, "Validity is required"),
      durationUnit: z.string().optional(),
      inclusions: z.string().optional(),
      exclusions: z.string().optional(),
      displayOnPortfolio: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Create Plan.",
    };
  }

  const {
    name,
    price,
    validity,
    durationUnit,
    inclusions,
    exclusions,
    displayOnPortfolio,
  } = validatedFields.data;

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
        durationUnit: durationUnit || "MONTHLY",
        inclusions: inclusionList,
        exclusions: exclusionList,
        displayOnPortfolio: displayOnPortfolio === "on",
      },
    });
    revalidatePath("/dashboard/plans");
    return { success: true, message: "Plan created successfully." };
  } catch (error) {
    return { message: "Database Error: Failed to Create Plan." };
  }
}

export async function deletePlan(id: string) {
  try {
    await prisma.plan.delete({ where: { id } });
    revalidatePath("/dashboard/plans");
    return { success: true, message: "Plan deleted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to delete plan." };
  }
}

// --- Showcase Actions ---

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
      tags: z.string().optional(),
      isFeatured: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Create Project.",
    };
  }

  const { title, description, imageUrl, siteUrl, repoUrl, tags, isFeatured } =
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
        isFeatured: isFeatured === "on",
      },
    });

    await logAction("CREATE_PROJECT", "Showcase", title, "Created new project");

    revalidatePath("/dashboard/showcase");
    return { success: true, message: "Project created successfully." };
  } catch (error) {
    return { message: "Database Error: Failed to Create Project." };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.showcase.delete({ where: { id } });
    revalidatePath("/dashboard/showcase");
    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to delete project." };
  }
}
