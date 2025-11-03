'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

const DropdownNavItem = ({ label, items }: { label: string; items: string[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div
          className="cursor-pointer relative flex gap-1.5 items-center select-none"
          whileHover="hover"
        >
          {label}
          {open ? (
            <ChevronUp className="text-[#7C4A4A] mt-[1px]" size={16} />
          ) : (
            <ChevronDown className="text-[#7C4A4A] mt-[1px]" size={16} />
          )}
          <motion.span
            className="absolute left-1/2 -bottom-1 h-[2px] w-full bg-[#7C4A4A] origin-center"
            initial={{ scaleX: 0 }}
            variants={{
              hover: { scaleX: 1 },
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ translateX: '-50%' }}
          />
        </motion.div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="text-[#7C4A4A] p-2 mt-2 rounded-sm bg-white flex flex-col !z-50">
        {items.map((cat) => (
          <DropdownMenuItem
            key={cat}
            asChild
            className="hover:!border-none hover:!bg-transparent font-semibold cursor-pointer hover:!text-[#A6686A]"
          >
            <Link href={`/category/${cat.toLowerCase().replace(' ', '-')}`}>{cat}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SecondaryNav = () => {
  const navItems = [
    { label: 'CATEGORIES', type: 'dropdown', items: ['Modest Gown', 'Abaya', 'Hijab'] },
    { label: 'NEW IN', href: '/new-in' },
    { label: 'SALE', href: '/sale' },
    { label: 'TRACK ORDER', href: '/track-order' },
  ];

  return (
    <div className="hidden md:flex text-[#7C4A4A] w-full items-center justify-center text-sm font-medium p-3 gap-9">
      {navItems.map((item) =>
        item.type === 'dropdown' ? (
          <DropdownNavItem key={item.label} label={item.label} items={item.items} />
        ) : (
          <motion.div
            key={item.label}
            className="relative cursor-pointer"
            whileHover="hover"
          >
            <Link href={item.href || '/'}>{item.label}</Link>
            <motion.span
              className="absolute left-1/2 -bottom-1 h-[2px] w-full bg-[#7C4A4A] origin-center"
              initial={{ scaleX: 0 }}
              variants={{
                hover: { scaleX: 1 },
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ translateX: '-50%' }}
            />
          </motion.div>
        )
      )}
    </div>
  );
};

export default SecondaryNav;
