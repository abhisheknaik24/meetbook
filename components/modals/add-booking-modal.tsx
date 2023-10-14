'use client';

import { postBooking } from '@/actions/postBooking';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, utcToZonedTime } from 'date-fns-tz';
import { CalendarIcon, Plus, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import _ from 'underscore';
import * as z from 'zod';
import { queryClient } from '../providers/query-provider';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  summary: z.string().min(1, {
    message: 'Booking summary must be required!',
  }),
  description: z.string().optional(),
  date: z.date(),
  fromHour: z.string(),
  fromMinute: z.string(),
  toHour: z.string(),
  toMinute: z.string(),
  isCalendarEvent: z.boolean(),
});

const AddBookingModal = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const params = useParams();

  const [guest, setGuest] = useState<string | undefined>(undefined);

  const [guests, setGuests] = useState<string[]>([]);

  const { type, isOpen, data: room, onClose } = useModal();

  const isModalOpen = isOpen && type === 'addBooking';

  const timeZone = 'Asia/Kolkata';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: undefined,
      description: undefined,
      date: new Date(),
      fromHour: '10',
      fromMinute: '0',
      toHour: '11',
      toMinute: '0',
      isCalendarEvent: true,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuest(e.target.value);
  };

  const handleAddGuestClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (Number(room.data.capacity) - 1 <= guests.length) {
      toast.error('Room capacity full!');

      return false;
    }

    if (!guest) {
      toast.error('Please enter the guest!');

      return false;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(guest)) {
      toast.error('This not valid email!');

      return false;
    }

    if (guests.includes(guest)) {
      toast.error('Email already added!');

      return false;
    }

    let newGuests = [...guests, guest];

    setGuests(newGuests);

    setGuest(undefined);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const date = utcToZonedTime(new Date(), timeZone);

      const newFromTime = utcToZonedTime(new Date(), timeZone);

      newFromTime.setHours(Number(values.fromHour));

      newFromTime.setMinutes(Number(values.fromMinute));

      const newToTime = utcToZonedTime(new Date(), timeZone);

      newToTime.setHours(Number(values.toHour));

      newToTime.setMinutes(Number(values.toMinute));

      const newValues = {
        locationId: params.locationId as string,
        roomId: params.roomId as string,
        summary: values.summary,
        description: values.description,
        date: date,
        fromTime: newFromTime,
        toTime: newToTime,
        guests: !!guests.length ? guests.join(',') : undefined,
        isCalendarEvent: values.isCalendarEvent,
      };

      const res = await postBooking(newValues);

      toast.success(res.message);

      form.reset();

      setGuest(undefined);

      setGuests([]);

      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      onClose();

      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!isModalOpen) {
    return null;
  }

  if (!room) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='h-full overflow-y-auto scrollbar-hide'>
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogDescription>
            For room {room?.data.title} is capacity {room?.data.capacity}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='summary'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Summary'
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Description'
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
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
              <div className='grid grid-cols-2 gap-2'>
                <FormField
                  control={form.control}
                  name='fromHour'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Hour</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='From Hour' />
                          </SelectTrigger>
                          <SelectContent position='item-aligned'>
                            {_.range(1, 25).map((value) => (
                              <SelectItem key={value} value={value.toString()}>
                                {value.toString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='fromMinute'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Minute</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='From Minute' />
                          </SelectTrigger>
                          <SelectContent position='item-aligned'>
                            {_.range(60).map((value) => (
                              <SelectItem key={value} value={value.toString()}>
                                {value.toString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <FormField
                  control={form.control}
                  name='toHour'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Hour</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='To Hour' />
                          </SelectTrigger>
                          <SelectContent position='item-aligned'>
                            {_.range(1, 25).map((value) => (
                              <SelectItem key={value} value={value.toString()}>
                                {value.toString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='toMinute'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Minute</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='To Minute' />
                          </SelectTrigger>
                          <SelectContent position='item-aligned'>
                            {_.range(60).map((value) => (
                              <SelectItem key={value} value={value.toString()}>
                                {value.toString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name='isCalendarEvent'
              render={({ field }) => (
                <FormItem className='flex items-center justify-start space-x-2 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormLabel>Add Event In Google Calendar</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-6 items-end gap-2 '>
              <FormItem className='col-span-5' onChange={handleChange}>
                <FormLabel>
                  Guests (Capacity : {room?.data.capacity}) (Remaining :{' '}
                  {!!guests.length
                    ? room?.data.capacity - guests.length - 1
                    : room?.data.capacity - 1}
                  )
                </FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Guests'
                    value={guest}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
              <Button
                type='button'
                className='col-span-1'
                onClick={handleAddGuestClick}
                disabled={isLoading}
              >
                <Plus />
              </Button>
            </div>
            <div className='flex flex-wrap items-center justify-start gap-2'>
              <p className='px-2 py-1 rounded-md'>{session?.user.email}</p>
              {!!guests.length &&
                guests.map((guest) => (
                  <p
                    key={guest}
                    className='flex items-center justify-start gap-2 bg-secondary/50 px-2 py-1 rounded-md'
                  >
                    {guest}
                    <Button
                      type='button'
                      className='p-0'
                      variant='ghost'
                      onClick={() =>
                        setGuests((prev) =>
                          prev.filter((value) => value !== guest)
                        )
                      }
                    >
                      <XCircle size={20} />
                    </Button>
                  </p>
                ))}
            </div>
            <Button type='submit' variant='secondary' disabled={isLoading}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(AddBookingModal);
