import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongo";
import { createUser, getUserByEmail } from "@/queries/user";
import { SignupFormSchema } from "@/lib/definitions";

export const POST = async (request) => {
  const { name, email, password } = await request.json();

  const validatedFields = SignupFormSchema.safeParse({
    name,
    email,
    password,
  });

  if (!validatedFields.success) {
    console.log("zod:", validatedFields.error.flatten().fieldErrors);
    const error = validatedFields.error.flatten().fieldErrors;
    return NextResponse.json(
      { error, message: "Invalid form data" },
      {
        status: 400,
      }
    );
  }

  try {
    const user = await getUserByEmail(email);

    if (user) {
      return NextResponse.json(
        { message: "user already exist" },
        { status: 400 }
      );
    }

    // Create a DB connection
    await dbConnect();
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Form a DB payload
    const newUser = {
      name,
      password: hashedPassword,
      email,
    };

    // Update the DB
    await createUser(newUser);

    return NextResponse.json("User has been created", {
      status: 201,
    });
  } catch (err) {
    return NextResponse.json(err, {
      status: 500,
    });
  }
};
