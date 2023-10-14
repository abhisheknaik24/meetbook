import { Logo } from '@/components/logo/logo';
import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import { Separator } from '@/components/ui/separator';
import LoginButton from './login-button';

const Navbar = () => {
  return (
    <div className='h-10 w-full flex items-center justify-between'>
      <Logo />
      <div className='h-full w-full flex items-center justify-end gap-2'>
        <ModeToggle />
        <Separator className='h-6 bg-secondary mx-2' orientation='vertical' />
        <LoginButton>Log in</LoginButton>
      </div>
    </div>
  );
};

export default Navbar;
