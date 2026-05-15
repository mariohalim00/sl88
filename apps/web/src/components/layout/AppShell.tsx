import type { PropsWithChildren } from "react";
import { Heart, Menu, ShoppingBag, User } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

const scrollLinks = [
  { id: "about-us", label: "About Us" },
  { id: "collection", label: "Collection" },
  { id: "contact-us", label: "Contact Us" },
];

const navLinks = [
  { href: "/shop/all", label: "Catalogue" },
];

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();

  const handleScrollClick = (id: string, event: React.MouseEvent) => {
    event.preventDefault();

    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-[#1c1c15]">
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#d4c4ac]/50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-20 md:px-16">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-[#1c1c15] transition-opacity hover:opacity-80 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <Link to="/" className="font-serif text-xl tracking-tight text-[#1c1c15] md:text-2xl">
              LuxeWeave
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {scrollLinks.map((item) => (
              <button
                key={item.id}
                onClick={(e) => handleScrollClick(item.id, e)}
                className="border-b-2 border-transparent pb-1 text-sm font-semibold tracking-[0.08em] uppercase text-[#504533] transition-colors hover:text-[#1c1c15]"
              >
                {item.label}
              </button>
            ))}
            {navLinks.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "border-b-2 pb-1 text-sm font-semibold tracking-[0.08em] uppercase transition-colors",
                    isActive
                      ? "border-[#f4b400] text-[#f4b400]"
                      : "border-transparent text-[#504533] hover:text-[#1c1c15]",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-[#1c1c15] md:gap-6">
            <LanguageSwitcher />
            <button type="button" aria-label="Bag" className="transition-opacity hover:opacity-80">
              <ShoppingBag className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Favorites"
              className="hidden transition-opacity hover:opacity-80 sm:block"
            >
              <Heart className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Account"
              className="hidden transition-opacity hover:opacity-80 sm:block"
            >
              <User className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pt-24 pb-10 md:px-16 md:pt-32 md:pb-20">
        {children}
      </main>
    </div>
  );
}
