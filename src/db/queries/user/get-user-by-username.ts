"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { getUser } from "./get-user";

export const getUserByUsername = async (username: string) => {
  const user = await getUserFromClerk(username);

  if (!user) {
    throw new Error("No User Found with this Username");
  }

  const userId = user.id;

  const data = await getUser(userId);

  if (!data) {
    throw new Error("No User Found with this Username");
  }

  return data;
};

const getUserFromClerk = async (username: string) => {
  const client = await clerkClient();

  const allClerkUsers = await client.users.getUserList({
    username: [username],
  });
  const user = allClerkUsers.data.find((u) => u.username === username);

  return user;
};
