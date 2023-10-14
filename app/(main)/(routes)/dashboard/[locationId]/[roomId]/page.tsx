'use client';

import { getRoomDetails } from '@/actions/getRoomDetails';
import { Time } from '@/components/time/time';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { utcToZonedTime } from 'date-fns-tz';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { memo, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

const Booking = dynamic(() => import('@/app/(main)/_components/booking'), {
  ssr: false,
  loading: () => <Skeleton className='h-24 w-full' />,
});

const RoomPage = () => {
  const params = useParams();

  const [color, setColor] = useState<string | null>(null);

  const { onOpen } = useModal();

  const colors = useMemo(
    () => [
      'from-red-500/50',
      'from-orange-500/50',
      'from-amber-500/50',
      'from-yellow-500/50',
      'from-lime-500/50',
      'from-green-500/50',
      'from-emerald-500/50',
      'from-teal-500/50',
      'from-cyan-500/50',
      'from-sky-500/50',
      'from-blue-500/50',
      'from-indigo-500/50',
      'from-violet-500/50',
      'from-purple-500/50',
      'from-fuchsia-500/50',
      'from-pink-500/50',
      'from-rose-500/50',
    ],
    []
  );

  const timeZone = 'Asia/Kolkata';

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['roomDetails', params.locationId, params.roomId],
    queryFn: ({ queryKey }) =>
      getRoomDetails(queryKey[1] as string, queryKey[2] as string),
    enabled: !!params.locationId && !!params.roomId,
    refetchInterval: 1000,
  });

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [colors]);

  if (!params.locationId || !params.roomId) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className='h-full w-full' />;
  }

  if (isError) {
    return null;
  }

  if (!res.data) {
    return null;
  }

  return (
    <div
      className={cn(
        'h-full w-full relative bg-gradient-to-b rounded-md px-6 py-4 overflow-y-auto scrollbar-hide',
        color
      )}
    >
      <div className='flex flex-col-reverse items-start justify-between gap-2 w-full mb-6 md:flex-row'>
        <div className='flex flex-col items-start justify-between gap-4'>
          <h1 className='text-6xl text-foreground font-bold capitalize'>
            {res.data.room.title}
          </h1>
          <div className='w-full flex items-center justify-start gap-2'>
            {res.data.room.isAvailable ? (
              <span className='text-xl font-medium bg-emerald-500 text-emerald-50 px-4 py-2 rounded-md whitespace-nowrap hover:bg-emerald-500/90'>
                Available
              </span>
            ) : (
              <span className='text-xl font-medium bg-rose-500 text-rose-50 px-4 py-2 rounded-md whitespace-nowrap hover:bg-rose-500/90'>
                Not Available
              </span>
            )}
            <Button
              className='text-xl whitespace-nowrap'
              variant='secondary'
              size='lg'
              onClick={() => onOpen('addBooking', { data: res.data.room })}
            >
              Book
            </Button>
          </div>
        </div>
        <div className='w-full flex items-center justify-start md:justify-end'>
          <Time />
        </div>
      </div>
      {!!res.data.room.bookings.length && (
        <div>
          <h3 className='text-2xl font-semibold mb-3'>Bookings</h3>
          <div className='flex flex-col items-start justify-start gap-2'>
            {res.data.room.bookings.map(
              (booking: {
                id: string;
                summary: string;
                fromTime: Date;
                toTime: Date;
                user: {
                  id: string;
                  username: string;
                };
              }) => (
                <Booking
                  key={booking.id}
                  locationId={params.locationId as string}
                  roomId={params.roomId as string}
                  bookingId={booking.id}
                  summary={booking.summary}
                  fromTime={utcToZonedTime(new Date(booking.fromTime), timeZone)}
                  toTime={utcToZonedTime(new Date(booking.toTime), timeZone)}
                  user={booking.user}
                  active={
                    utcToZonedTime(booking.fromTime, timeZone) <= new Date() &&
                    utcToZonedTime(booking.toTime, timeZone) >= new Date()
                  }
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RoomPage);
