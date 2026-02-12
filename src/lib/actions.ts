"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    name?: string[];
    domain?: string[];
    billingStatus?: string[];
    email?: string[];
    password?: string[];
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
});

const CreateClient = FormSchema.omit({
  id: true,
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
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors as State["errors"],
      message: "Missing Fields. Failed to Create Client.",
    };
  }

  const { name, domain, billingStatus } = validatedFields.data;

  try {
    const newClient = await prisma.client.create({
      data: {
        name,
        domain,
        billingStatus,
        maintenanceMode: false,
      },
    });
    revalidatePath("/dashboard");
    return {
      success: true,
      client: newClient,
      message: "Client created successfully.",
    };
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Client.",
    };
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
