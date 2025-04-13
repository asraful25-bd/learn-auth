import { auth } from "./auth";

export async function middleware(request) {
  const { nextUrl } = request;
  const session = await auth();
  const isAuthenticated = !!session?.user;
  // console.log("middleware");
  // return Response.redirect(new URL("/sign-up", nextUrl));
}

// export const config = {
//   matcher: ["/", "/(api|trpc)(.*)"],
// };
