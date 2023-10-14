'use client';

import { updateLocation } from '@/actions/updateLocation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
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
  name: z.string().min(1, {
    message: 'Location name must be required!',
  }),
});

const EditLocationModal = () => {
  const router = useRouter();

  const { type, isOpen, data: location, onClose } = useModal();

  const isModalOpen = isOpen && type === 'editLocation';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newValues = {
        ...values,
        locationId: location?.data.locationId as string,
      };

      const res = await updateLocation(newValues);

      toast.success(res.message);

      form.reset();

      queryClient.invalidateQueries({ queryKey: ['locations'] });

      onClose();

      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!isModalOpen) {
    return null;
  }

  if (!location) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Location {location?.data.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' disabled={isLoading} {...field} />
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
};

export default memo(EditLocationModal);
