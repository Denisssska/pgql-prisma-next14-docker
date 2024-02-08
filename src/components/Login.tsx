'use client';

import { login, logout } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export interface IntSession {
  session?: {
    user: {
      email: string;
      password: string;
      name: string;
    };
    expires: string;
    iat: number;
    exp: number;
  };
}
const LoginPage: React.FC<IntSession> = ({ session }) => {
  const handlerAction = async (data: FormData) => {
    console.log(data.get('email'));
    if (session) {
      await logout();
    } else await login(data);
    // redirect('/');
  };
  return (
    <div className='flex flex-col justify-center h-full m-auto w-[50%] gap-4'>
      <h1 className='text-center'>Login</h1>
      <form action={handlerAction} className='flex flex-col gap-4'>
        <Input type='text' name='email' placeholder='Email' />
        <Input type='text' name='password' placeholder='Password' />
        <Button>{session ? 'Logout' : 'Login'}</Button>
      </form>

      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default LoginPage;
