import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-[#1E4E5F] text-white hover:bg-[#1E4E5F]/90 focus-visible:ring-[#1E4E5F]',
      secondary: 'bg-[#F5EBE6] text-[#1E4E5F] hover:bg-[#E6D5CC] focus-visible:ring-[#E6D5CC]',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
      ghost: 'bg-transparent hover:bg-[#E6D5CC]/20 text-[#1E4E5F] focus-visible:ring-[#1E4E5F]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        type={props.type || 'button'}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button'; 