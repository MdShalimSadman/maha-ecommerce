'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const SecondaryNav = () => {
  const navItems = [
    { label: 'CATEGORIES', type: 'dropdown', items: ['Modest Gown', 'Abaya', 'Hijab'] },
    { label: 'NEW IN', href: '/new-in' },
    { label: 'SALE', href: '/sale' },
    { label: 'TRACK ORDER', href: '/track-order' },
  ];

  return (
    <div className="hidden md:flex text-[#7C4A4A] w-full items-center justify-center text-sm font-medium p-3 gap-9">
      {navItems.map((item) => {
        if (item.type === 'dropdown') {
          return (
            <DropdownMenu key={item.label}>
              <DropdownMenuTrigger asChild>
                <motion.div
                  className="cursor-pointer relative flex gap-1.5 items-center"
                  whileHover="hover"
                >
                  {item.label}
                  <ChevronDown className='text-[#7C4A4A] mt-[1px]'/>
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
                {item.items.map((cat) => (
                  <DropdownMenuItem key={cat} asChild className='hover:!border-none hover:!bg-transparent font-semibold cursor-pointer hover:!text-[#A6686A]'>
                    <Link href={`/category/${cat.toLowerCase().replace(' ', '-')}`}>
                      {cat}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        } else {
          return (
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
          );
        }
      })}
    </div>
  );
};

export default SecondaryNav;
