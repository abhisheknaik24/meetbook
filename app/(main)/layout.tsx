import { Header } from './_components/header';
import { MiniSidebar } from './_components/mini-sidebar';
import { Sidebar } from './_components/sidebar';

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
      <div className='h-full w-full px-1 md:pl-80 md:pr-0'>
        <Header />
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
