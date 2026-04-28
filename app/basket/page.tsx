import { BasketScreen } from "@/app/basket/_components/basket-screen";

export default async function BasketPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const params = await searchParams;
  return <BasketScreen tableNumber={params.table ?? null} />;
}
