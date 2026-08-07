import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const ADMIN_HASH = "$2b$12$nQob7RelGBf6CTsSGYIcNuGwtORkGBBA5/KHpgNVIVwe1sgF/TNFS";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email !== process.env.ADMIN_EMAIL) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          ADMIN_HASH
        );
        if (!valid) return null;
        return { id: "1", email: credentials.email as string, name: "Admin" };
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
});
