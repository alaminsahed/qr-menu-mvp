import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "tapbite.org";

  const tenantSlug = host.endsWith(`.${rootDomain}`)
    ? host.slice(0, -(rootDomain.length + 1))
    : null;

  return updateSession(request, tenantSlug);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
