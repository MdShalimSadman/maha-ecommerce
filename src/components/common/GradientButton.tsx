import { FC, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const GradientButton: FC<{
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  hoverTextColorClass?: string;
  hoverBgColorClass?: string;
  borderColorClass?: string;
  disabled?: boolean; // ✅ new prop
}> = ({
  children,
  onClick,
  className,
  hoverTextColorClass = 'group-hover:text-[#7C4A4A]',
  hoverBgColorClass = 'bg-white',
  borderColorClass = 'border-[#7C4A4A]',
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled} // ✅ ensures the button is not clickable
      className={cn(
        'group relative z-0 overflow-hidden rounded-full bg-gradient-to-r from-[#7C4A4A] to-[#A6686A] text-white transition-all duration-500',
        disabled
          ? 'opacity-50 cursor-not-allowed pointer-events-none' // ✅ visual + functional disable state
          : 'hover:opacity-90',
        className,
      )}
    >
      <span
        className={cn(
          'relative z-10 transition-colors duration-300',
          !disabled && hoverTextColorClass, // ✅ disable hover text change when inactive
        )}
      >
        {children}
      </span>

      {!disabled && ( // ✅ only show hover effects when enabled
        <>
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span
              className={cn(
                'absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 translate-y-1/2 rounded-full transition-all duration-700 ease-in-out group-hover:h-[500px] group-hover:w-[500px]',
                hoverBgColorClass,
              )}
            />
          </span>

          <span
            className={cn(
              'pointer-events-none absolute inset-0 rounded-full border opacity-0 transition-opacity duration-500 group-hover:opacity-100',
              borderColorClass,
            )}
          />
        </>
      )}
    </Button>
  );
};

export default GradientButton;
