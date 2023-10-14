'use client';

import { getRooms } from '@/actions/getRooms';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useModal } from '@/hooks/use-modal-store';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { memo } from 'react';
import { useQuery } from 'react-query';
import SidebarItem from './sidebar-item';

const Sidebar = () => {
  const { data: session } = useSession();

  const params = useParams();

  const { onOpen } = useModal();

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['rooms', params.locationId],
    queryFn: ({ queryKey }) => getRooms(queryKey[1] as string),
    enabled: !!params.locationId,
    refetchInterval: 1000,
  });

  if (!params.locationId) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className='h-full w-60 fixed left-20' />;
  }

  if (isError) {
    return null;
  }

  return (
    <div className='h-full w-60 absolute flex flex-col left-20 bg-secondary/50 px-2 py-4 z-10 overflow-y-auto scrollbar-hide'>
      {session?.user.role === 'admin' && (
        <>
          <div className='w-full'>
            <Button
              className='w-full'
              variant='secondary'
              onClick={() => onOpen('addRoom')}
            >
              Add New Room
            </Button>
          </div>
          <Separator className='my-3 bg-foreground/10' />
        </>
      )}
      <div className='w-full h-full'>
        <h3 className='text-lg font-semibold text-foreground/90 mb-3 pl-2'>
          Rooms
        </h3>
        <div className='flex flex-col items-start justify-start gap-2 w-full h-full'>
          {!!res?.data.rooms.length ? (
            res.data.rooms.map(
              (room: {
                id: string;
                title: string;
                capacity: number;
                isAvailable: boolean;
              }) => (
                <SidebarItem
                  key={room.id}
                  locationId={params.locationId as string}
                  roomId={room.id}
                  title={room.title}
                  capacity={room.capacity}
                  isAvailable={room.isAvailable}
                  active={params.roomId === room.id}
                />
              )
            )
          ) : (
            <div className='text-sm font-semibold text-foreground/50'>
              No rooms found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
