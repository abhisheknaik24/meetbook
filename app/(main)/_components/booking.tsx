'use client';

import { deleteBooking } from '@/actions/deleteBooking';
import { queryClient } from '@/components/providers/query-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns-tz';
import { Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import toast from 'react-hot-toast';

interface BookingProps {
  locationId: string;
  roomId: string;
  bookingId: string;
  summary: string;
  fromTime: Date;
  toTime: Date;
  active: boolean;
  user: {
    id: string;
    username: string;
  };
}

const Booking = ({
  locationId,
  roomId,
  bookingId,
  summary,
  fromTime,
  toTime,
  user,
  active,
}: BookingProps) => {
  const { data: session } = useSession();

  const router = useRouter();

  const handleDeleteClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    bookingId: string
  ) => {
    try {
      const res = await deleteBooking({
        locationId,
        roomId,
        bookingId,
      });

      toast.success(res.message);

      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={cn(
        'h-24 w-full flex items-center justify-between p-4 rounded-md cursor-pointer',
        active
          ? 'bg-secondary border-2 border-foreground/50'
          : 'bg-secondary/80 hover:bg-secondary/50'
      )}
    >
      <div className='flex flex-col items-start justify-center'>
        <h3
          className={cn(
            'text-lg font-semibold capitalize',
            active ? 'text-foreground' : 'text-foreground/90'
          )}
        >
          {summary}
        </h3>
        <p
          className={cn(
            'text-sm',
            active ? 'text-foreground' : 'text-foreground/50'
          )}
        >
          {format(fromTime, 'hh:mm aa')}
          <span className='mx-1'>-</span>
          {format(toTime, 'hh:mm aa')}
        </p>
        <p className='text-sm font-semibold'>{user.username}</p>
      </div>
      {(session?.user.role === 'admin' || session?.user.id === user.id) &&
        !active && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='danger' size='icon'>
                      <Trash2 size={20} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete booking.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => handleDeleteClick(e, bookingId)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p className='font-semibold capitalize'>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
    </div>
  );
};

export default memo(Booking);
