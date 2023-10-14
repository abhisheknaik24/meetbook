import { cn } from '@/lib/utils';
import { Dancing_Script } from 'next/font/google';
import { memo } from 'react';

const font = Dancing_Script({ subsets: ['latin'] });

export const Logo = memo(function Logo() {
  return (
    <div className='flex items-center justify-start text-2xl text-sky-500 font-bold xl:text-4xl'>
      <h1 className={cn('truncate', font.className)}>Meetbook</h1>
    </div>
  );
});
