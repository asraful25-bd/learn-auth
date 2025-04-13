import { z } from "zod";

export const SignupFormSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(2, { message: "Name must be at least 2 characters long." })
      .regex(/[^0-9]/, {
        message: "Name must be Contain only character.",
      })
      .trim(),
    email: z.string().email({ message: "Please enter a valid email" }).trim(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
  })
  .required();
