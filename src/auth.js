import NextAuth, { AuthError } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "./queries/user";

const secretKey = process.env.JWT_SECRET;

class customError extends AuthError {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}

async function refreshAccessToken(token) {
  try {
    // Generate tokens
    const accessToken = jwt.sign({ userId: foundUser._id }, secretKey, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign({ userId: foundUser._id }, secretKey, {
      expiresIn: "2m",
    });

    return {
      ...token,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        // try {
        //   // logic to verify if the user exists
        //   const foundUser = await getUserByEmail(credentials.email);

        //   if (!foundUser) {
        //     // No user found, so this is their first attempt to login
        //     // meaning this is also the place you could do registration
        //     throw new customError("User not found", 401);
        //     // return user;
        //   }

        //   const isMatch = await bcrypt.compare(
        //     credentials.password,
        //     foundUser.password
        //   );

        //   // console.log('isMatch::', isMatch);

        //   if (!isMatch) {
        //     throw new customError("Invalid credentials", 400);
        //     // return user;
        //   }

        //   // Generate tokens
        //   const accessToken = jwt.sign({ userId: foundUser._id }, secretKey, {
        //     expiresIn: "1m",
        //   });
        //   const refreshToken = jwt.sign({ userId: foundUser._id }, secretKey, {
        //     expiresIn: "2m",
        //   });

        //   user = {
        //     accessToken,
        //     refreshToken,
        //     role: "user",
        //     email: foundUser.email,
        //     name: foundUser.name,
        //   };
        //   return user
        // } catch (error) {
        //   console.error(
        //     "error from next-auth signIn handler catch block::",
        //     error
        //   );
        //   // throw new customError(`server error`, 500);
        // }

        // logic to verify if the user exists
        const foundUser = await getUserByEmail(credentials.email);

        if (!foundUser) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new customError("User not found", 401);
          // return user;
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          foundUser.password
        );

        if (!isMatch) {
          throw new customError("Invalid credentials", 400);
        }

        // Generate tokens
        const accessToken = jwt.sign({ userId: foundUser._id }, secretKey, {
          expiresIn: "1m",
        });
        const refreshToken = jwt.sign({ userId: foundUser._id }, secretKey, {
          expiresIn: "2m",
        });

        return {
          accessToken,
          refreshToken,
          role: "user",
          email: foundUser.email,
          name: foundUser.name,
        };
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    signIn: async ({user, account}) => {
      if(account.provider === 'github') {
        try {
          const isUserExist = await getUserByEmail(user.email);
          if(isUserExist) {
            return user;
          }
          await createUser({name: user.name, email: user.email, avater: user.image});
        } catch (error) {
          console.error('error from singIn callback catch block::', error)
        }
      }

      return user;
    },
    jwt: async ({ token, account, user }) => {
      if (token.accessToken) {
        const decodedToken = jwt.decode(token.accessToken);
        token.accessTokenExpires = decodedToken?.exp * 1000;
      }

      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user,
        };
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      /*** Update refresh token ***/
      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      if (token) {
        (session.accessToken = token.accessToken),
          (session.refreshToken = token.refreshToken);
      }
      return session;
    },
  },
});
