import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// In-memory user store (will be replaced with a real DB later)
// For now we use a simple approach: localStorage on client, this map on server
const registeredUsers: Map<string, { id: string; name: string; email: string; password: string }> = new Map()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/analytics.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        name: { label: "Nom", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        const name = credentials?.name as string
        const action = credentials?.action as string

        if (!email || !password) {
          throw new Error("Email et mot de passe requis")
        }

        // Registration flow
        if (action === "register") {
          if (!name) {
            throw new Error("Nom requis pour l'inscription")
          }
          if (registeredUsers.has(email)) {
            throw new Error("Un compte existe deja avec cet email")
          }
          const id = crypto.randomUUID()
          registeredUsers.set(email, { id, name, email, password })
          return { id, name, email }
        }

        // Login flow
        const user = registeredUsers.get(email)
        if (!user || user.password !== password) {
          throw new Error("Email ou mot de passe incorrect")
        }
        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      if (token.accessToken) {
        // @ts-ignore: NextAuth doesn't expose accessToken by default
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})
