"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const UserRegisterPage = () => {
  const [error, setError] = useState({ form: null, message: "" });
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError((prv) => ({ ...prv, message: "" }));
    try {
      const formData = new FormData(event.currentTarget);

      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (response.status === 400) {
        const res = await response.json();
        if (res.error) {
          setError({ ...error, form: res.error, message: res.message });
        }
        if (!res.error) {
          setError({ ...error, form: null, message: res.message });
        }
      }

      response.status === 201 && router.push("/");
    } catch (error) {
      console.log("error from sign-up handler catch:", error);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 border">
        <label htmlFor="name">
          <input
            type="text"
            id="name"
            className="text-black"
            name="name"
            placeholder="John Due"
          />
          {error.form?.name && (
            <ul className="text-xs text-red-300">
              {error.form.name.map((e, i) => (
                <li key={i}>-{e}</li>
              ))}
            </ul>
          )}
        </label>
        <label htmlFor="email">
          <input
            type="email"
            id="email"
            className="text-black"
            name="email"
            placeholder="Johndue@email.com"
          />
          {error.form?.email && (
            <ul className="text-xs text-red-300">
              {error.form.email.map((e, i) => (
                <li key={i}>-{e}</li>
              ))}
            </ul>
          )}
        </label>
        <label htmlFor="password">
          <input
            type="password"
            id="password"
            className="text-black"
            name="password"
            placeholder="12345"
          />
          {error.form?.password && (
            <ul className="text-xs text-red-300">
              {error.form.password.map((e, i) => (
                <li key={i}>-{e}</li>
              ))}
            </ul>
          )}
        </label>
        <button type="submit">Register</button>
      </form>
      {!error.form && <p>{error.message}</p>}
    </div>
  );
};

export default UserRegisterPage;
