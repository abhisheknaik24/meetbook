import { axiosInstance } from '@/lib/axiosInstance';

export const getLocations = async () => {
  const res = await axiosInstance.get('/api/location');

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
