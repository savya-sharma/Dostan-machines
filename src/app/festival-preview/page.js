import { notFound } from "next/navigation";
import DiwaliShowcase from "@/components/festival/diwali/DiwaliShowcase";

export const metadata = {
  title: "Festival preview | Dostan Machines",
  robots: { index: false, follow: false },
};

// Development-only gallery of the Diwali artwork and where each piece goes.
// In production this route is a 404.
export default function FestivalPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <DiwaliShowcase />;
}
