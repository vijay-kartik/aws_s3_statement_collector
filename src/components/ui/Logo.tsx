'use client';

import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image 
        src="/app-logo.png"
        alt="Statement Collector Logo"
        width={512}
        height={512}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
} 