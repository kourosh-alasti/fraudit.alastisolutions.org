"use server";

import db from "@/db/drizzle";
import { fraudits } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getFrauditBySlug = async (slug: string) => {
  const data = await db.query.fraudits.findFirst({
    where: eq(fraudits.slug, slug),
    with: {
      threads: {
        orderBy: (threads, { desc }) => [desc(threads.updatedAt)],
        with: {
          comments: {
            orderBy: (comments, { desc }) => [desc(comments.updatedAt)],
          },
        },
      },
    },
  });

  return data;
};
