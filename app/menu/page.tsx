import { MenuScreen } from "@/components/client/menu-screen";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const params = await searchParams;
  return <MenuScreen tableNumber={params.table ?? null} />;
}
