import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { memo } from 'react';
import { MiniSidebar } from './mini-sidebar';
import { Sidebar } from './sidebar';

export const Header = memo(function Header() {
  return (
    <div className='md:hidden h-20 w-full flex items-center justify-start'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='secondary'>
            <Menu size={25} />
          </Button>
        </SheetTrigger>
        <SheetContent className='w-full p-0' side='left'>
          <MiniSidebar />
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
});
