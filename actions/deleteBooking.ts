import { axiosInstance } from '@/lib/axiosInstance';

interface IBooking {
  locationId: string;
  roomId: string;
  bookingId: string;
}

export const deleteBooking = async ({
  locationId,
  roomId,
  bookingId,
}: IBooking) => {
  const res = await axiosInstance.delete(
    `/api/location/${locationId}/room/${roomId}/booking/${bookingId}`
  );

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
