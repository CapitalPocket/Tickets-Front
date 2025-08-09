import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { ApiResponse, LoginResponse } from '@/app/lib/definitions';
import axios from 'axios';

async function getUser(
  email: string,
  password: string,
): Promise<LoginResponse | undefined> {
  try {
    const response = await axios.post<ApiResponse>(
      `https://api.pockiaction.xyz/api/taquilla/loginUser`,

      { email, password },
    );

    const apiResponse = response.data;
    const { message } = apiResponse;

    if (apiResponse.user) {
      const user = apiResponse.user;
      return {
        user: {
          idUser: user.id_user.toString(),
          name: user.name,
          email: user.email,
          password: user.password,
          rol: user.rol,
          park: user.idpark,
          changePass: user.changepassword,
          statusprofile: user.statusprofile,
        },
        message,
      };
    }
    return { message };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const {handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: 'zCMNmlHUQGlBdB6sKlITf88/4K3I9NRfuXOFZ0R6ON0=',
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().min(3), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const response = await getUser(email, password);

          if (!response?.user) return null;

          if (response.user.statusprofile === 'Deshabilitado') {
            throw new Error('User is disabled.');
          }
          if (response.user.statusprofile === 'Eliminado') {
            throw new Error('User is disabled.');
          }
          return {
            idUser: response.user.idUser,
            name: response.user.name,
            email: response.user.email,
            role: response.user?.rol,
            park: response.user?.park,
            changePass: response.user?.changePass,
          };
        }
        return null;
      },
    }),
  ],


    
});
