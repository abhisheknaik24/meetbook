import { axiosInstance } from '@/lib/axiosInstance';

interface ILocation {
  locationId: string;
  name: string;
}

export const updateLocation = async ({ locationId, name }: ILocation) => {
  const res = await axiosInstance.patch(`/api/location/${locationId}`, {
    name,
  });

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
