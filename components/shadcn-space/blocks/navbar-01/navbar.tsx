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
import ButtonDemo from "../../button/button-16";

interface NavbarProps {
  navigationData: NavigationSection[];
}

const Navbar = ({ navigationData }: NavbarProps) => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-[#caf0f8]">
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

          <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
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
                      "px-4 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-transparent text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          <label className="hidden max-w-xl flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 md:flex">
            <Search size={18} className="text-slate-400" />
            <input
              aria-label="Search products"
              placeholder=" برای پیدا کردن محصولت تایپ کن ..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

         

          <div className="lg:hidden">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger className="rounded-full bg-background border border-border p-2 outline-none flex items-center justify-center cursor-pointer">
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