import { setUser } from '@/services/state/user/userSlice';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Set up a schema and type for the form fields
//  Since we don't have a backend, we'll hardcode the allowed email and password
const allowedEmail = 'dan@upliftcodecamp.com';
const allowedPassword = 'swordfish';

const schema = z.object({
  email: z.string().refine(value => value === allowedEmail),
  password: z.string().refine(value => value === allowedPassword),
});

type LoginFields = z.infer<typeof schema>;

export function useLoginForm() {
  // MARK: Form
  const { setItem: setEmail, getItem: getEmailFromLS } = useLocalStorage('email');
  const { setItem: setIsLoggedIn } = useLocalStorage('isLoggedIn');
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    defaultValues: {
      email: getEmailFromLS() || '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  // Update local storage when form values change
  const formValues = watch();
  useEffect(() => {
    setEmail(formValues.email);
  }, [formValues.email, setEmail, isSubmitting]);

  // MARK: Submit
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<LoginFields> = async (data: LoginFields) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      const result = schema.safeParse(data);
      if (!result.success) {
        setError('root', {
          message: result.error.errors[0].message,
        });
        return;
      }

      reset();

      // Handle form submission
      useLocalStorage('id').setItem('1000000000001');
      useLocalStorage('email').setItem(data.email);
      useLocalStorage('familyName').setItem('Labrador');
      useLocalStorage('givenName').setItem('Dan');
      useLocalStorage('picture').setItem(
        `https://ui-avatars.com/api/?background=9050ad&color=fff&name=Dan+Labrador&size=40`
      );

      dispatch(
        setUser({
          id: 1000000000001,
          email: data.email,
          familyName: 'Labrador',
          givenName: 'Dan',
          picture: `https://ui-avatars.com/api/?background=9050ad&color=fff&name=Dan+Labrador&size=40`,
        })
      );

      setIsLoggedIn('true');
    } catch (error) {
      setError('root', {
        message: 'Invalid email or password.',
      });
    }
  };

  return {
    errors,
    handleSubmit,
    isSubmitting,
    onSubmit,
    register,
  };
}
