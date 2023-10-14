'use client';

import { getLocations } from '@/actions/getLocations';
import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { memo } from 'react';
import { useQuery } from 'react-query';
import { MiniSidebarItem } from './mini-sidebar-item';

export const MiniSidebar = memo(function MiniSidebar() {
  const { data: session } = useSession();

  const params = useParams();

  const { onOpen } = useModal();

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return <Skeleton className='h-full w-20 fixed' />;
  }

  if (isError) {
    return null;
  }

  return (
    <div className='h-full w-20 flex flex-col fixed bg-secondary px-2 py-4 z-20'>
      <div className='flex items-center justify-center w-full'>
        <h1 className='font-bold text-4xl text-sky-500'>M</h1>
      </div>
      <Separator className='my-3 bg-foreground/10' />
      <div
        className={cn(
          'flex flex-col items-center justify-start gap-4 h-full w-full overflow-y-auto scrollbar-hide',
          session?.user.role === 'admin' ? 'pb-2' : 'py-2'
        )}
      >
        {session?.user.role === 'admin' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='w-full'>
                  <Button
                    className='h-14 w-full bg-background text-sky-500 hover:bg-background/60'
                    size='icon'
                    onClick={() => onOpen('addLocation')}
                  >
                    <Plus size={30} strokeWidth={3} />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side='right'>
                <p className='font-semibold capitalize'>Add New Location</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {!!res?.data.locations.length &&
          res.data.locations.map((location: { id: string; name: string }) => (
            <MiniSidebarItem
              key={location.id}
              locationId={location.id}
              name={location.name}
              active={params.locationId === location.id}
            />
          ))}
      </div>
      <Separator className='my-3 bg-foreground/10' />
      <div className='flex items-center justify-center w-full'>
        <ModeToggle />
      </div>
      <Separator className='my-3 bg-foreground/10' />
      <div className='flex items-center justify-center w-full'>
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className='h-12 w-12 cursor-pointer'>
              <AvatarImage src={session?.user?.image} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent side='right' className='w-48 text-center'>
            <p className='capitalize font-semibold'>{session?.user?.name}</p>
            <Separator className='my-1 bg-foreground/10' />
            <Button
              className='w-full'
              variant='danger'
              onClick={() => signOut()}
            >
              Log Out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});
