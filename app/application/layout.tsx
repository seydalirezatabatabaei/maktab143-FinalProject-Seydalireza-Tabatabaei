import Navbar from "@/components/shadcn-space/blocks/navbar-01/navbar";
import { NavigationSection } from "../types/types";

const navigationData: NavigationSection[] = [
  
  {
    title: "خرید اقساطی ",
    href: "/application/#",
  },
  {
    title: "فروشگاه",
    href: "/application/products",
  },
  {
    title: " سبد خرید ",
    href: "#",
  },
];

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
    

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );}