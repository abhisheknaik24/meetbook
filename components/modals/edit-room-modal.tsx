'use client';

import { updateRoom } from '@/actions/updateRoom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { queryClient } from '../providers/query-provider';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Room title must be required!',
  }),
  capacity: z.preprocess(
    (value) => parseInt(z.string().parse(value)),
    z.number().positive().gte(1, {
      message: 'Room capacity must be required at least 1!',
    })
  ),
});

export const EditRoomModal = memo(function EditRoomModal() {
  const router = useRouter();

  const params = useParams();

  const { type, isOpen, data: room, onClose } = useModal();

  const isModalOpen = isOpen && type === 'editRoom';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: undefined,
      capacity: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newValues = {
        ...values,
        locationId: params.locationId as string,
        roomId: room?.roomId as string,
      };

      const res = await updateRoom(newValues);

      if (!res.status) {
        toast.error(res.message);

        return false;
      }

      toast.success(res.message);

      form.reset();

      queryClient.invalidateQueries({ queryKey: ['rooms'] });

      onClose();

      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!!room?.title && !!room?.capacity) {
      form.setValue('title', room.title);

      form.setValue('capacity', room.capacity);
    }
  }, [form, room]);

  if (!isModalOpen) {
    return null;
  }

  if (!room?.title || !room?.capacity) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Room {room.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Title'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='capacity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Capacity'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' variant='secondary' disabled={isLoading}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
