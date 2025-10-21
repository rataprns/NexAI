
'use server'

import { clearSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function logout() {
  await clearSession();
  revalidatePath('/', 'layout');
}
