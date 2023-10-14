import { axiosInstance } from '@/lib/axiosInstance';

export const getRooms = async (locationId: string) => {
  const res = await axiosInstance.get(`/api/location/${locationId}/room`);

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
