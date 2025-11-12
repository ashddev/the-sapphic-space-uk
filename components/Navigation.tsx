"use client";
import { cn } from "@/lib/utils";
import { ExternalLink, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

// Todo:
// Handle outside clicks to auto-close menu
// Animate menu open/close with framer-motion
// Support accessibility with ARIA attributes

const links = [
  { name: "Home", href: "#" },
  { name: "About Us", href: "#" },
  { name: "Our Team", href: "#" },
  { name: "In The Press", href: "#" },
  { name: "Shop", href: "#", icon: <ExternalLink size={15} /> },
] as const;

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6 md:px-4 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <div className="py-2">
            <Image
              src="/TheSapphicSpaceUK.png"
              width={80}
              height={80}
              alt={"The Sappic Space UK"}
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden space-x-6 md:flex md:items-center">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={"text-gray-700 transition hover:text-pink-300"}
              >
                <div className="flex items-center gap-1">
                  {link.name} {link.icon ?? ""}
                </div>
              </Link>
            ))}
          </div>

          <div className="hidden space-x-6 md:flex md:items-center">
            <Link
              href={"https://www.outsavvy.com/organiser/the-sapphic-space"}
              target={"_blank"}
              className={
                "w-fit rounded-xl bg-pink-300 p-2 px-4 font-semibold transition hover:text-white"
              }
            >
              Buy Tickets
            </Link>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button
              variant={"outline"}
              onClick={() => setOpen(!open)}
              className="text-gray-700 transition hover:text-pink-300"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
      {open && (
        <div className="md:hidden" px-4 pb-4 space-y-2>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn("block", link.className ?? "text-gray-700")}
            >
              <div className="flex items-center gap-1">
                {link.name} {link.link ?? ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
