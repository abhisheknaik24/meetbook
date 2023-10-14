import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import Header from './_components/header';

const MiniSidebar = dynamic(() => import('./_components/mini-sidebar'), {
  ssr: false,
  loading: () => <Skeleton className='h-full w-20 fixed' />,
});

const Sidebar = dynamic(() => import('./_components/sidebar'), {
  ssr: false,
  loading: () => <Skeleton className='h-full w-60 fixed left-20' />,
});

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className='relative h-screen w-full'>
      <div className='fixed h-full w-full hidden md:block'>
        <MiniSidebar />
        <Sidebar />
      </div>
      <div className='relative h-full w-full px-1 md:pl-80 md:pr-0'>
        <Header />
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
