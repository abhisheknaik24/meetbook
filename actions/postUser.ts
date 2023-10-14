import { axiosInstance } from '@/lib/axiosInstance';

interface IUser {
  username: string | null | undefined;
  email: string | null | undefined;
  picture: string | null | undefined;
}

export const postUser = async ({ username, email, picture }: IUser) => {
  const res = await axiosInstance.post('/api/user', {
    username,
    email,
    picture,
  });

  if (!res.status) {
    throw new Error('Something went wrong!');
  }

  return res.data;
};
