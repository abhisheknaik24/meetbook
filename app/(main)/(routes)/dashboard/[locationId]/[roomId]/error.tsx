'use client';

import { Button } from '@/components/ui/button';

interface RoomErrorProps {
  error: Error;
  reset: () => void;
}

const RoomError = ({ error, reset }: RoomErrorProps) => {
  return (
    <div className='fixed inset-0 h-full w-full bg-black flex flex-col items-center justify-center gap-4 z-50'>
      <h3 className='text-2xl text-rose-500 font-semibold capitalize'>
        {error.message}
      </h3>
      <Button variant='outline' onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
};

export default RoomError;
