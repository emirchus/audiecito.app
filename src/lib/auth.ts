"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const signOutAction = async () => {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");

  return redirect("/login");
};

export type UserSession = NonNullable<Awaited<NonNullable<ReturnType<typeof getSession>>>>;

export const getSession = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Obtener el perfil del usuario
  // const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return {
    user,
  };
};
