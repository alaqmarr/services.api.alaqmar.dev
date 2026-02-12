"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    name?: string[];
    domain?: string[];
    billingStatus?: string[];
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
const UpdateClient = FormSchema.omit({ id: true }); // Simplified for now

export async function createClient(prevState: any, formData: FormData) {
  const validatedFields = CreateClient.safeParse({
    name: formData.get("name"),
    domain: formData.get("domain"),
    billingStatus: formData.get("billingStatus"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Client.",
    };
  }

  const { name, domain, billingStatus } = validatedFields.data;

  try {
    // We need the created client to return it
    const newClient = await prisma.client.create({
      data: {
        name,
        domain,
        billingStatus,
        maintenanceMode: false,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, client: newClient };
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
    return; // Don't return object to satisfy form action type
  }
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    return; // Don't return object to satisfy form action type
  }
}
