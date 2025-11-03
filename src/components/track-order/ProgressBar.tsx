'use client';

import type { FC } from 'react';

import { motion } from 'framer-motion';

import TruckProgress from './TruckProgress';
import { Card } from '../ui/card';

interface Section {
  id: string;
  title: string;
  iconColor: string;
}

interface ProgressBarProps {
  sections: Section[];
  visibleSections: number;
  currentIndex: number;
  progressPercentage: number;
}

const ProgressBar: FC<ProgressBarProps> = ({
  sections,
  visibleSections,
  currentIndex,
  progressPercentage,
}) => {
  const total = sections.length;

  return (
    <Card className='mt-4 p-4 px-6'>
      <div className="flex w-full items-center justify-center rounded-2xl bg-white">
        <div className="relative w-[97%] mt-4">
          {/* Progress bar with colored sections */}
          <div className="relative h-3 overflow-hidden rounded-full">
            {sections.map((s, i) => {
              const sectionWidth = 100 / total;
              const isCompleted = i < visibleSections;
              const isCurrent = i === visibleSections - 1;

              return (
                <div
                  key={s.id}
                  className="absolute top-0 h-full transition-all duration-500"
                  style={{
                    left: `${i * sectionWidth}%`,
                    width: `${sectionWidth}%`
                  }}
                >
                  {/* Disabled section color (always there) */}
                  <div
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.iconColor, opacity: 0.2 }}
                  />

                  {/* Completed section - full color */}
                  {isCompleted && (
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{ backgroundColor: s.iconColor }}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  )}

                  {/* Current section - partial progress */}
                  {isCurrent && (
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{ backgroundColor: s.iconColor }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(progressPercentage % (100 / total)) * total}%`
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Phase labels centered in their sections */}
          <div className="relative mt-6 flex">
            {sections.map((s, i) => {
              const sectionWidth = 100 / total;
              const isActive = i < visibleSections;

              return (
                <motion.button
                  key={s.id}
                  className="group relative flex flex-col items-center justify-center transition-all focus:outline-none"
                  style={{ width: `${sectionWidth}%` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* <motion.div
                    className="mb-2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-xs md:text-sm font-bold text-white shadow-lg transition-all"
                    style={{
                      backgroundColor: s.iconColor,
                      opacity: isActive ? 1 : 0.2
                    }}
                    animate={i === currentIndex ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {i + 1}
                  </motion.div> */}
                  <span
                    className="whitespace-nowrap text-[10px] md:text-xs font-semibold transition-all"
                    style={{ color: isActive ? s.iconColor : '#9CA3AF' }}
                  >
                    {s.title.split(':')[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <TruckProgress
            progressPercentage={progressPercentage}
            currentIndex={currentIndex}
            sections={sections}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProgressBar;
