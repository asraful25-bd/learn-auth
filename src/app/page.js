import Image from "next/image";
import SignIn from "./components/sign-in";
import { auth, signOut } from "@/auth";
import Stopwatch from "./components/Stopwatch";

export default async function Home() {
  const session = await auth();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>{JSON.stringify(session?.user)}</div>
      <div>
        <SignIn />
      </div>
      <div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Sign Out</button>
        </form>
      </div>
      <Stopwatch />
    </main>
  );
}
