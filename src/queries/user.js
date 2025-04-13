import User from "@/model/user";

export async function createUser(user) {
  try {
    await User.create(user);
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email: email })
      .select()
      .lean();
    return user;
  } catch (error) {
    throw new Error(error);
  }
}
