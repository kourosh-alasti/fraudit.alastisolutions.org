"use server";

import db from "@/db/drizzle";
import { threads } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getThreadById = async (id: string) => {
  const data = await db.query.threads.findFirst({
    where: eq(threads.id, id),
    with: {
      comments: {
        orderBy: (comments, { desc }) => [desc(comments.updatedAt)],
      },
      user: {
        columns: {
          id: true,
          createdAt: true,
        },
      },
    },
  });

  if (!data) {
    console.error(data);
    throw new Error("Thread not found");
  }

  return data;
};
