import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { google } from "googleapis";
import type { JWT } from "next-auth/jwt";

interface ExtendedToken extends JWT {
  accessToken?: string | null;
  accessTokenExpires?: number;
  refreshToken?: string;
  error?: string;
}

async function refreshAccessToken(
  token: ExtendedToken
): Promise<ExtendedToken> {
  try {
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    client.setCredentials({
      refresh_token: token.refreshToken,
    });

    const { credentials } = await client.refreshAccessToken();
    return {
      ...token,
      accessToken: credentials.access_token,
      accessTokenExpires: credentials.expiry_date
        ? credentials.expiry_date * 1000
        : undefined,
      refreshToken: credentials.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const newToken = token as ExtendedToken;

      // Initial sign in
      if (account) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : undefined,
          refreshToken: account.refresh_token ?? newToken.refreshToken,
        };
      }

      // Return previous token if the access token has not expired yet
      if (
        typeof newToken.accessTokenExpires === "number" &&
        Date.now() < newToken.accessTokenExpires
      ) {
        return newToken;
      }

      // Access token has expired, refresh it
      return await refreshAccessToken(newToken);
    },

    async session({ session, token }) {
      // Type-safe assignment
      return {
        ...session,
        accessToken: (token as ExtendedToken).accessToken,
        error: (token as ExtendedToken).error,
      } as Session & { accessToken?: string | null; error?: string };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
