import { axiosInstance } from '@/lib/axiosInstance';

export const getRoomDetails = async (locationId: string, roomId: string) => {
  const res = await axiosInstance.get(
    `/api/location/${locationId}/room/${roomId}`
  );

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
