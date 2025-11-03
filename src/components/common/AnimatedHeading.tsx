"use client";
import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  text: string;
  color?: string;  
  delay?: number;  
  isSlash?: boolean; 
}

export default function AnimatedHeading({
  text,
  color = "#A6686A",
  delay = 0.4,
  isSlash = true,
}: AnimatedHeadingProps) {
  return (
    <motion.div
      className="flex items-end gap-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.3 } },
      }}
    >
      {/* Slash animation — only if isSlash is true */}
      {isSlash && (
        <motion.span
          variants={{
            hidden: { rotate: 90, opacity: 0 },
            visible: {
              rotate: 0,
              opacity: 1,
              transition: {
                duration: 0.6,
                ease: "easeOut",
                type: "spring",
                stiffness: 200,
                damping: 12,
              },
            },
          }}
          className="font-medium text-xl origin-bottom inline-block"
          style={{ color }}
        >
          /
        </motion.span>
      )}

      {/* Text animation */}
      <motion.span
        variants={{
          hidden: { x: -30, opacity: 0 },
          visible: {
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.8,
              ease: "easeOut",
              delay,
            },
          },
        }}
        className="font-medium text-xl"
        style={{ color }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}
