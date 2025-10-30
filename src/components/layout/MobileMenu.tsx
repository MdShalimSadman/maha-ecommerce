"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Menu } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import LogoutDropdown from "../auth/LogoutButton";

interface NavItem {
  label: string;
  type?: "accordion";
  items?: string[];
  href?: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ navItems }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden">
          <Menu className="text-[#7C4A4A] hover:text-[#A6686A]" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-64 p-4">
        <SheetHeader className="h-0">
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
        <div>
          <GlobalSearch />
        </div>

        <div className="flex flex-col gap-2 text-[#7C4A4A] flex-1 h-full overflow-y-auto">
          {navItems.map((item) => {
            if (item.type === "accordion" && item.items) {
              return (
                <Accordion type="single" collapsible key={item.label}>
                  <AccordionItem value={item.label}>
                    <AccordionTrigger className="flex justify-between items-center font-semibold !py-2">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col pl-4 font-semibold">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem}
                          href={`/category/${subItem
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          className="py-1"
                          onClick={() => setOpen(false)} // <-- close sheet on click
                        >
                          {subItem}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            } else {
              return (
                <Link
                  key={item.label}
                  href={item.href || "/"}
                  className="py-2 font-medium"
                  onClick={() => setOpen(false)} // <-- close sheet on click
                >
                  {item.label}
                </Link>
              );
            }
          })}
        </div>
        <div>
            <LogoutDropdown/>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
