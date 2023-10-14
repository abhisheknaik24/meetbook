'use client';

import { deleteLocation } from '@/actions/deleteLocation';
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import toast from 'react-hot-toast';

interface MiniSidebarItemProps {
  locationId: string;
  name: string;
  active: boolean;
}

export const MiniSidebarItem = memo(function MiniSidebarItem({
  locationId,
  name,
  active,
}: MiniSidebarItemProps) {
  const { data: session } = useSession();

  const router = useRouter();

  const { onOpen } = useModal();

  const handleDeleteClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    locationId: string
  ) => {
    try {
      const res = await deleteLocation({
        locationId,
      });

      toast.success(res.message);

      queryClient.invalidateQueries({ queryKey: ['locations'] });

      router.refresh();

      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AlertDialog>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Link href={`/dashboard/${locationId}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'h-14 w-14 flex items-center justify-center bg-secondary-foreground/10 border-2 border-secondary-foreground/10 rounded-full',
                      active &&
                        'outline outline-2 outline-sky-500 outline-offset-2'
                    )}
                  >
                    <p className='text-xl font-semibold uppercase'>
                      {name.charAt(0)}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p className='font-semibold capitalize'>{name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </ContextMenuTrigger>
        {session?.user.role === 'admin' && (
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => onOpen('editLocation', { locationId, name })}
            >
              Edit
            </ContextMenuItem>
            <ContextMenuItem className='hover:bg-rose-500/90 focus:bg-rose-500/90'>
              <AlertDialogTrigger>Delete</AlertDialogTrigger>
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete location.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleDeleteClick(e, locationId)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
