'use client';

import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
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