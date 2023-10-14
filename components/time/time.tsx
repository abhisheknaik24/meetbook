'use client';

import { format } from 'date-fns-tz';
import { memo, useEffect, useState } from 'react';

export const Time = memo(function Time() {
  const [isMounted, setIsMounted] = useState(false);

  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <h3 className='text-6xl text-foreground font-semibold'>
      {format(date, 'hh:mm:ss aa')}
    </h3>
  );
});
