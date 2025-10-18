'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import Link from 'next/link';


const SecondaryNav = () => {
  const navItems = [
    { label: 'CATEGORIES', type: 'dropdown', items: ['Modest Gown', 'Abaya', 'Hijab'] },
    { label: 'NEW IN', href: '/new-in' },
    { label: 'SALE', href: '/sale' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <div className="bg-[#7C4A4A] w-full text-white/90 flex items-center justify-center text-sm font-medium p-2 gap-9">
      {navItems.map((item) => {
        if (item.type === 'dropdown') {
          return (
            <DropdownMenu key={item.label}>
              <DropdownMenuTrigger asChild>
                <motion.span
                  className="cursor-pointer relative"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                  <motion.span
                    className="absolute left-1/2 bottom-0 h-[2px] bg-white origin-center"
                    layoutId="underline"
                  />
                </motion.span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#7C4A4A] p-2 rounded-sm text-white flex flex-col !z-50">
                {item.items.map((cat) => (
                  <DropdownMenuItem key={cat} asChild>
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
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <Link href={item.href||"/"} className="cursor-pointer">
                {item.label}
              </Link>
              <motion.span
                className="absolute left-1/2 bottom-0 h-[2px] bg-white origin-center"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          );
        }
      })}
    </div>
  );
};

export default SecondaryNav;
