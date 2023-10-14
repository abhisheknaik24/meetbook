import { cn } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { Poppins } from 'next/font/google';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Navbar } from './_components/navbar';

const font = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout = async ({ children }: LandingLayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!!session?.user) {
    return redirect('/dashboard');
  }

  return (
    <div
      className={cn(
        'relative h-screen w-full bg-background px-4 py-2',
        font.className
      )}
    >
      <Navbar />
      {children}
    </div>
  );
};

export default LandingLayout;
