import { jwtDecode } from 'jwt-decode';
import { AppDispatch } from '../state/store';
import { setUser } from '../state/user/userSlice';
import { User } from '@/models/User';

type GoogleLoginResponse = {
  clientId: string;
  client_id: string;
  credential: string;
  select_by: string;
};

type GoogleUser = {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  iat: number /** The time the token was issued, in seconds since the epoch. */;
  name: string;
  picture: string;
  sub: string;
};

type SetLocalStorageItem = (value: string) => void;

export default class GoogleIdentity {
  private _googleUser: GoogleUser;

  constructor() {
    this._googleUser = {} as GoogleUser;
  }

  get user() {
    return this._googleUser;
  }

  set user(user: GoogleUser) {
    this._googleUser = user;
  }

  async renderButton(
    dispatch: AppDispatch,
    setIsLoggedIn: SetLocalStorageItem,
    setId: SetLocalStorageItem,
    setEmail: SetLocalStorageItem,
    setFamilyName: SetLocalStorageItem,
    setGivenName: SetLocalStorageItem,
    setPicture: SetLocalStorageItem
  ): Promise<void> {
    /* global google */
    await google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLOUD_CLIENT_ID as string,
      callback(response: GoogleLoginResponse): void {
        const userObject = jwtDecode(response.credential);
        this._googleUser = userObject as GoogleUser;

        const user: User = {
          id: parseInt(this._googleUser.sub),
          email: this._googleUser.email,
          familyName: this._googleUser.family_name,
          givenName: this._googleUser.given_name,
          picture: this._googleUser.picture,
        };

        dispatch(setUser(user));
        setIsLoggedIn('true');
        setId(user.id.toString());
        setEmail(user.email);
        setFamilyName(user.familyName);
        setGivenName(user.givenName);
        setPicture(user.picture);
      },
    });

    await google.accounts.id.renderButton(document.getElementById('g_id_onload'), {
      theme: 'outline', // outline, filled_blue, filled_black
      size: 'large', // small, medium, large
      text: 'continue_with', // continue_with, sign_in_with, signup_with, signin
      shape: 'circular', // rectangular, pill
      logo_alignment: 'left', // left, center
      locale: 'en',
      // type: 'standard',
      width: '320px',
      // state - example: `button 1` - Optional, as multiple Sign in with Google buttons can be rendered on the same page, you can assign each button with a unique string. The same string would return along with the ID token, so you can identify which button user clicked to sign in.
      click_listener: async () => {
        google.accounts.id.prompt();
      },
    });
  }

  async logout(): Promise<void> {
    await google.accounts.id.disableAutoSelect();
    await google.accounts.id.prompt();
  }
}
