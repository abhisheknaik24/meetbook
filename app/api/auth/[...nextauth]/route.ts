import { postUser } from '@/actions/postUser';
import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: process.env.GOOGLE_CLIENT_SCOPE as string,
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (user && account?.provider === 'google') {
        const username = user.name;
        const email = user.email;
        const picture = user.image;

        try {
          const res = await postUser({ username, email, picture });

          if (!res.status) {
            return false;
          }

          user.id = res.data.user.id;

          user.role = res.data.user.role;

          return true;
        } catch (error: any) {
          return false;
        }
      }

      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;

        token.role = user.role;

        token.accessToken = account?.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;

        session.user.role = token.role as string;

        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
