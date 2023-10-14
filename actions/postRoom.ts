import { axiosInstance } from '@/lib/axiosInstance';

interface IRoom {
  locationId: string;
  title: string;
  capacity: number;
}

export const postRoom = async ({ locationId, title, capacity }: IRoom) => {
  const res = await axiosInstance.post(`/api/location/${locationId}/room`, {
    title,
    capacity,
  });

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
