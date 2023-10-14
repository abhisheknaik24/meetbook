'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { memo } from 'react';

interface LoginButtonProps {
  children: React.ReactNode;
}

const LoginButton = ({ children }: LoginButtonProps) => {
  return (
    <Button className='text-lg font-semibold' onClick={() => signIn('google')}>
      {children}
    </Button>
  );
};

export default memo(LoginButton);
