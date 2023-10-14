import { axiosInstance } from '@/lib/axiosInstance';

interface IRoom {
  locationId: string;
  roomId: string;
}

export const deleteRoom = async ({ locationId, roomId }: IRoom) => {
  const res = await axiosInstance.delete(
    `/api/location/${locationId}/room/${roomId}`
  );

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
