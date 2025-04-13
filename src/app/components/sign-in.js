"use client";

import { useRouter } from "next/navigation";
import { signIn, socialSignIn } from "../actions/authentication";
import { useState } from "react";

export default function SignIn() {
  const [error, setError] = useState(null);
  const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const response = await signIn(formData);
      if (response.error) {
        // set error state
        setError(response.error.message);
      } else {
        // set clean error state
        setError(null);
        router.refresh();
      }
    } catch (error) {
      console.error("error from signIn page catch block::", error);
      // set error state
      setError(error.error?.message);
    }
  }

  return (
    <div className="flex flex-col border p-2 gap-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <label htmlFor="email">
          Email
          <input
            type="email"
            id="email"
            name="email"
            placeholder="johndue@gmail.com"
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            name="password"
            placeholder="12345"
            className="text-black"
          />
        </label>
        <button>Sign In</button>
      </form>
      <form
        action={() => {socialSignIn('github')}}
      >
        <button type="submit">SignIn with Github</button>
      </form>
      {error && <pre className="text-red-400">{error}</pre>}
    </div>
  );
}
