import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const session = await auth();
  const user = session?.user;
  return new NextResponse(JSON.stringify(user), {
    status: 200,
  });
};
