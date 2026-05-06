import { NextResponse } from "next/server";
import { getAdminRestaurant } from "@/lib/admin/get-restaurant";
import { createClient } from "@/lib/supabase/server";

export type ApiError = {
  error: string;
};

export function badRequest(message: string) {
  return NextResponse.json<ApiError>({ error: message }, { status: 400 });
}

export function unauthorized() {
  return NextResponse.json<ApiError>(
    { error: "You are not authorized to perform this action." },
    { status: 401 },
  );
}

export function serverError(message = "Internal server error.") {
  return NextResponse.json<ApiError>({ error: message }, { status: 500 });
}

export async function requireAdminUser() {
  const supabase = await createClient();
  const member = await getAdminRestaurant(supabase);
  if (!member) return null;
  return { restaurant_id: member.restaurant_id, role: member.role };
}
