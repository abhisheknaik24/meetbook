'use client';

import { Button } from '@/components/ui/button';

interface MainErrorProps {
  error: Error;
  reset: () => void;
}

const MainError = ({ error, reset }: MainErrorProps) => {
  return (
    <div className='fixed inset-0 h-full w-full flex flex-col items-center justify-center gap-4 bg-background z-50'>
      <h3 className='text-2xl text-rose-500 font-semibold capitalize'>
        {error.message}
      </h3>
      <Button variant='ghost' onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
};

export default MainError;
