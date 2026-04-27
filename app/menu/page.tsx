import { MenuScreen } from "@/app/menu/_components/menu-screen";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const params = await searchParams;
  return <MenuScreen tableNumber={params.table ?? null} />;
}
