"use server";
import { signIn as authSignIn } from "@/auth";

export async function signIn(formData) {
  try {
    const response = await authSignIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    console.log("signIn res from singIn action:", response);

    return response;
  } catch (error) {
    console.log("signIn error from signIn action:", error);
    if (error.type === "AuthError") {
      return {
        error: { message: error.message },
      };
    }
    if (error.type === "CredentialsSignin") {
      console.log("cccc:::", error);
      return {
        error: { message: error.message },
      };
    }
    return {
      error: { message: "Failed to login", error },
    };
  }
}

export async function socialSignIn(providerName) {
  await authSignIn(providerName, {redirectTo: '/'});
}
