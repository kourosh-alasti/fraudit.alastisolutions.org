"use server";

import db from "@/db/drizzle";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getCommentById = async (id: string) => {
  const data = await db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: {
      user: {
        columns: {
          id: true,
          isAdmin: true,
        },
      },
      fraudit: {
        columns: {
          id: true,
          slug: true,
          descripton: true,
          ownerId: true,
          memberCount: true,
          title: true,
        },
      },
      threads: {
        columns: {
          content: true,
          frauditId: true,
          id: true,
          title: true,
          userId: true,
        },
      },
    },
  });

  if (!data) {
    throw new Error("Comment Not Found");
  }

  return data;
};
