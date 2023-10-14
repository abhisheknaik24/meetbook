import { axiosInstance } from '@/lib/axiosInstance';

interface ILocation {
  locationId: string;
}

export const deleteLocation = async ({ locationId }: ILocation) => {
  const res = await axiosInstance.delete(`/api/location/${locationId}`);

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
