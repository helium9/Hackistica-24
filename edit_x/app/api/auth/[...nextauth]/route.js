const connectDB = require("../../../../config/db");
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialProvider from "next-auth/providers/credentials"
// import userModel from "../../../../models/userModel.js"
const userModel = require("../../../../models/userModel");
import bcrypt from "bcrypt";


async function login(credentials){
    try{
        console.log(credentials)
        connectDB();
        const email = credentials.email;
        const user = await userModel.findOne({email});
        const users = await userModel.find();
        // console.log(userModel)
        console.log(users);
        console.log(user);
        if(!user) throw new Error("Wrong Credentials");
        const isCorrect = await bcrypt.compare(credentials.password,user.password);
        if(!isCorrect) throw new Error("Wrong credentials");
        return user;
    }catch(error){
        console.log(error);
        throw new Error("something went wrong")
    }
}

export const authOptions = {
  pages:{
    signIn: "/login",
  },
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    CredentialProvider({
      name:"credentials",
      credentials:{},
      async authorize(credentials){
        try {
            console.log(credentials);
          const user = await login(credentials);
          console.log("this is the user ",user);
          return user;
        } catch (error) {
          throw new Error("Failed to login");
        }
      }
    })
    // ...add more providers here
  ],
  callbacks:{
    async jwt({token,user}){
        if(user){
            token.username = user.username;
            token.email = user.email;
            token.id = user.id;
        }
        console.log("This is the token = ",token);
        return token;
    },
    async session({session,token}){
        if(token){
            session.user.username = token.username;
            session.user.email = token.email;
            session.user.id = token.id;
        }
        console.log("This is the session = ",session);
        return session;
    }
  }
}

const handler =  NextAuth(authOptions);
export {handler as GET, handler as POST} 