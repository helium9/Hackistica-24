import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";

// Build providers array conditionally based on available credentials
const providers = [];

// Only add GitHub provider if credentials are available
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        })
    );
}

// Only add Google provider if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

export const options: NextAuthOptions = {
    providers,
    // Use JWT strategy to avoid database requirements
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    // Remove custom pages to use NextAuth default pages
    // pages: {
    //     signIn: '/auth/signin',
    //     error: '/auth/error',
    // },
    callbacks: {
        async jwt({ token, account, user }) {
            // Only store minimal data in JWT to avoid large cookies
            if (account) {
                // Don't store the full access token, just provider info
                token.provider = account.provider;
            }
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            // Send only essential properties to the client
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session as any).provider = token.provider;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}