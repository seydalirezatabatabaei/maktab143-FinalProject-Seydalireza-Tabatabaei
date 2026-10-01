"use client";
import { NavigationSection } from "@/app/types/types";
import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu, NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Search, TextAlignJustify } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CartDialog from "@/components/cart-dialog";

interface NavbarProps {
  navigationData: NavigationSection[];
}

const Navbar = ({ navigationData }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const pathname = usePathname();

  return (
    <header className="glass-surface sticky top-0 z-40 w-full border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <nav
          className={cn(
            "w-full flex items-center justify-between gap-3.5 lg:gap-6 transition-all duration-500",
            // sticky
            //   ? "my-2 p-2.5 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full"
            //   : "my-3 bg-transparent border-transparent"
          )}
        >
          <Link href="/">
            <Logo />
          </Link>

          <NavigationMenu className="max-lg:hidden border border-border bg-muted p-0.5">
            <NavigationMenuList className="flex gap-0">
              {navigationData.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 transition-colors",
                      isActive
                        ? "border-b border-primary bg-muted text-primary"
                        : "bg-transparent text-foreground hover:text-primary"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <label className="hidden max-w-xl flex-1 items-center gap-3 border border-border bg-card px-4 py-2 md:flex">
            <Search size={18} className="text-muted-foreground" />
            <input
              aria-label="Search products"
              placeholder=" برای پیدا کردن محصولت تایپ کن ..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <CartDialog />

         

          <div className="lg:hidden">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger className="flex cursor-pointer items-center justify-center border border-border bg-background p-2 outline-none">
                <TextAlignJustify size={20} />
                <span className="sr-only">Menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                {navigationData.map((item) => (
                  <DropdownMenuItem key={item.title}>
                    <Link href={item.href} className="w-full text-sm font-medium">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
