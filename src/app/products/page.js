import ProductCategories from "@/components/ProductCategories";

export const metadata = {
  title: "Products | Dostan Machines",
};

export default function ProductsPage() {
  // ProductCategories is also used mid-page on the homepage, where its own
  // py-[6rem] is correct inter-section spacing — that component is left
  // untouched. Here, as this route's own page container, it doubles as the
  // top-of-page gap below the navbar, so it's nudged to match this route's
  // shared top spacing without changing the shared component.
  return (
    <div className="mt-[0.5rem]">
      <ProductCategories />
    </div>
  );
}
