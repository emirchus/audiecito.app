"use server";

import "server-only";

import { AuthError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const signInWithEmailAndPasswordAction = async (
  email: string,
  password: string,
): Promise<string | null | undefined> => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error instanceof AuthError) {
    switch (error.code) {
      case "invalid_credentials":
        return "Las credenciales son inválidas";
      default:
        return "Ha ocurrido un error. Código: " + error.code;
    }
  }

  revalidatePath("/", "layout");
  redirect(`/`);
};
