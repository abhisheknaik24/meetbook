import { Loader2 } from 'lucide-react';
import { memo } from 'react';

export const Loader = memo(function Loader() {
  return (
    <div className='fixed inset-0 h-full w-full flex items-center justify-center bg-background z-50'>
      <Loader2 className='text-foreground animate-spin' size={30} />
    </div>
  );
});
