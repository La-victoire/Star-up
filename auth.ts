import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries"
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-clients";
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub,GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
],
  session: {
    strategy: "jwt",
  },
 authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          prompt:"consent",
          access_type:"offline",
          response_type: "code",
          eventType:"admin", },
      },
  callbacks: {
    async signIn({
       user: {name, email, image},
       profile,
    }) {
       if (!profile) {
           console.log(" PROFILE IS UNDEFINED");
            return false;}
        const sub = profile.sub || "";
        const id = profile.id || sub || "";
       console.log("SignIn User Data:", {name, email, image, id, sub,}, "PROFILE DATA.", {profile});
       const existinguser = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
         id: id,});
      
         if(!existinguser) {
           await writeClient.create({
             _type: 'author',
             id: id,
             sub: sub || "",
             name,
             username:profile?.login || profile?.given_name ,
             email,
             image,
             bio: profile?.bio || "",
           });
         }
        return true;
      },
    async jwt({token, account, profile}) {
      if (account && profile) {
        const user = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, 
          {id:profile?.id || profile?.sub,});
          token.id = user._id;
        }
        return token;
    },
    async session({session, token}) {
      console.log("SESSION CALLBACK:", { session, token });
      Object.assign(session, {id: token.id});
      return session;
    }
  }
})
