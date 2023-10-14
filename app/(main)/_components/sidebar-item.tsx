'use client';

import { deleteRoom } from '@/actions/deleteRoom';
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
import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import toast from 'react-hot-toast';

interface SidebarItemProps {
  locationId: string;
  roomId: string;
  title: string;
  capacity: number;
  isAvailable: boolean;
  active: boolean;
}

export const SidebarItem = memo(function SidebarItem({
  locationId,
  roomId,
  title,
  capacity,
  isAvailable,
  active,
}: SidebarItemProps) {
  const { data: session } = useSession();

  const router = useRouter();

  const { onOpen } = useModal();

  const handleDeleteClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    roomId: string
  ) => {
    try {
      const res = await deleteRoom({
        locationId,
        roomId,
      });

      toast.success(res.message);

      queryClient.invalidateQueries({ queryKey: ['rooms'] });

      router.refresh();

      router.push(`/dashboard/${locationId}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Link
      href={`/dashboard/${locationId}/${roomId}`}
      className={cn(
        'flex items-center justify-between gap-2 px-4 py-2 w-full rounded-md cursor-pointer',
        active ? 'bg-secondary/90' : 'hover:bg-secondary/90'
      )}
    >
      <div className='flex items-center justify-start gap-2'>
        <div className='relative bg-sky-300/90 h-8 w-8 rounded-md flex items-center justify-center'>
          <p className='text-sky-700 text-lg font-semibold uppercase'>
            {title.charAt(0)}
          </p>
          <span className='absolute -top-1 -left-1 flex h-3 w-3'>
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
              )}
            ></span>
            <span
              className={cn(
                'relative inline-flex rounded-full h-3 w-3',
                isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
              )}
            ></span>
          </span>
        </div>
        <h3 className='capitalize text-foreground/50'>{title}</h3>
      </div>
      {session?.user.role === 'admin' && (
        <div className='flex items-center justify-end gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='text-secondary-foreground/50 p-0 hover:text-secondary-foreground/40'
                  variant='ghost'
                  onClick={() =>
                    onOpen('editRoom', { roomId, title, capacity })
                  }
                >
                  <Edit size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='font-semibold capitalize'>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className='text-rose-500/90 p-0 hover:text-rose-500/80'
                      variant='ghost'
                    >
                      <Trash2 size={20} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete room.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => handleDeleteClick(e, roomId)}
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
        </div>
      )}
    </Link>
  );
});
