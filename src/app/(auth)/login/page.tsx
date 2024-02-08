import { getSession } from '@/app/actions';
import LoginPage from '@/components/Login';

const Login = async () => {
  const session = await getSession();
  return <LoginPage session={session} />;
};

export default Login;
