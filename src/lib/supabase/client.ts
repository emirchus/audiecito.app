import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

import { createBrowserClient } from "@supabase/ssr";

export type SupabaseClientTyped = SupabaseClient<Database>;

let supabaseClient: SupabaseClientTyped;

function createClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return supabaseClient;
}

export const supabase = createClient();
