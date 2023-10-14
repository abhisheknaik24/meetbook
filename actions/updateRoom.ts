import { axiosInstance } from '@/lib/axiosInstance';

interface IRoom {
  locationId: string;
  roomId: string;
  title: string;
  capacity: number;
}

export const updateRoom = async ({
  locationId,
  roomId,
  title,
  capacity,
}: IRoom) => {
  const res = await axiosInstance.patch(
    `/api/location/${locationId}/room/${roomId}`,
    {
      title,
      capacity,
    }
  );

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
