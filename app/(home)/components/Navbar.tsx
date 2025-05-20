// components/Navbar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
export default function Navbar() {
  return (
    <header className="w-full absolute top-0 z-50 px-6 sm:px-12 py-4 flex items-center justify-between text-white">
      <Link href="/" className="text-xl font-bold tracking-wide">
        FashionStore
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/collections" className="hover:text-yellow-400 transition">
          Collections
        </Link>
        <Link href="/about" className="hover:text-yellow-400 transition">
          About
        </Link>
        <Link href="/contact" className="hover:text-yellow-400 transition">
          Contact
        </Link>
        <Button className="bg-white text-black hover:bg-gray-100 font-semibold">
          Shop Now
        </Button>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden">
     <Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Menu className="w-6 h-6 text-white" />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="bg-neutral-900 text-white">
    {/* ✅ Add DialogTitle here */}
    <DialogTitle className="text-lg font-semibold mt-4">
      Menu
    </DialogTitle>

    <nav className="flex flex-col gap-6 mt-6 text-lg p-5">
      <Link href="/" className="hover:text-yellow-400 transition">
        Home
      </Link>
      <Link href="/collections" className="hover:text-yellow-400 transition">
        Collections
      </Link>
      <Link href="/about" className="hover:text-yellow-400 transition">
        About
      </Link>
      <Link href="/contact" className="hover:text-yellow-400 transition">
        Contact
      </Link>
      <Button className="mt-4 bg-white text-black hover:bg-gray-100">
        Shop Now
      </Button>
    </nav>
  </SheetContent>
</Sheet>
      </div>
    </header>
  );
}
