import NextAuth, { NextAuthOptions, Profile, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_SECRET_ID as string,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, user }) {
      return {user, ...session }
    },
    async signIn({ user, account, profile, email, credentials }) {
      try{
        return true
      }catch{
        return false
      }
    },
  }
})
