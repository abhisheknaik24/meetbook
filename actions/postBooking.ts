import { axiosInstance } from '@/lib/axiosInstance';

interface IBooking {
  locationId: string;
  roomId: string;
  summary: string;
  description: string | undefined;
  date: Date;
  fromTime: Date;
  toTime: Date;
  guests: string | undefined;
  isCalendarEvent: boolean;
}

export const postBooking = async ({
  locationId,
  roomId,
  summary,
  description,
  date,
  fromTime,
  toTime,
  guests,
  isCalendarEvent,
}: IBooking) => {
  const res = await axiosInstance.post(
    `/api/location/${locationId}/room/${roomId}/booking`,
    {
      summary,
      description,
      date,
      fromTime,
      toTime,
      isCalendarEvent,
      guests,
    }
  );

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
