import { axiosInstance } from '@/lib/axiosInstance';

interface ILocation {
  name: string;
}

export const postLocation = async ({ name }: ILocation) => {
  const res = await axiosInstance.post('/api/location', {
    name,
  });

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
