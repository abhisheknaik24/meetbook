'use client';

import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

const AuthPage = () => {
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (!!session?.user) {
      router.push('/dashboard');
    }
  }, [router, session]);

  return (
    <div className='h-full w-full bg-[url("/images/bg-img.webp")] bg-cover bg-center flex items-center justify-center'>
      <h1 className='text-4xl text-sky-500 text-center'>Meetbook</h1>
      <p className='text-muted-foreground mb-3'>
        Sign In with Your Google Account
      </p>
      <Button
        className='w-full'
        variant='outline'
        onClick={() => signIn('google')}
      >
        Google
      </Button>
    </div>
  );
};

export default memo(AuthPage);
