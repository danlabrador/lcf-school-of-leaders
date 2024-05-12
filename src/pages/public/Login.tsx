import { useGoogleSSO } from '@/hooks/useGoogleSSO';
import { WhiteLogo } from '../../components/WhiteLogo';
import { LoginFeatureImage } from '../../components/LoginFeatureImage';
import { Button } from '@/components/ui/button';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LabeledTextInput } from '../../components/LabeledTextInput';

export type FormValues = {
  email: 'dan@upliftcodecamp.com';
  password: 'swordfish';
};

const Login = () => {
  useGoogleSSO();
  const { errors, isSubmitting, handleSubmit, onSubmit, register } = useLoginForm();
  return (
    <div className="flex h-svh flex-col md:flex-row">
      <aside className="flex items-end relative w-full md:w-1/2">
        <LoginFeatureImage />
        <WhiteLogo />
      </aside>
      <div className='w-full h-[60px] md:hidden'/>
      <main className="flex justify-center items-center w-full pb-40 md:p-0 lg:p-0 h-svh md:w-1/2">
        <form className="flex flex-col space-y-4 p-8 w-[384px]" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-extrabold text-center">Log in to Lighthouse</h1>
          <LabeledTextInput id="email" label="Email" register={register} hookFormType="email" />
          <LabeledTextInput
            id="password"
            label="Password"
            type="password"
            register={register}
            hookFormType="password"
          />
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            Login
          </Button>
          <div
            id="g_id_onload"
            data-client_id="744543541785-v89rrt123mnl76h2ek2e3fvbq15erpob.apps.googleusercontent.com"
          />
          {errors.email || errors.password ? (
            <p className="text-red-500 text-sm">Invalid email or password.</p>
          ) : null}
        </form>
      </main>
    </div>
  );
};

export default Login;
