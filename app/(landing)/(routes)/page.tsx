import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import LoginButton from '../_components/login-button';

const LandingPage = () => {
  return (
    <div className='h-[calc(100%-2.5rem)] w-full flex flex-col items-center justify-start gap-6 pt-32 px-8 md:px-48'>
      <div className='flex flex-col items-center justify-start gap-2'>
        <p className='text-3xl text-foreground/80 text-center font-bold font-sans leading-10 capitalize md:text-[32px]'>
          where every meeting finds its perfect room
        </p>
        <h1 className='text-6xl text-sky-500 text-center font-black font-sans capitalize md:text-7xl'>
          meetbook
        </h1>
      </div>
      <LoginButton>
        Get meetbook <ArrowRight />
      </LoginButton>
      <div className='relative h-48 w-48'>
        <Image
          src='/assets/images/hero.webp'
          alt='hero'
          className='rounded-sm object-cover z-20 block dark:hidden'
          fill
        />
        <Image
          src='/assets/images/hero-dark.webp'
          alt='hero'
          className='rounded-sm object-cover z-10 hidden dark:block'
          fill
        />
      </div>
    </div>
  );
};

export default LandingPage;
