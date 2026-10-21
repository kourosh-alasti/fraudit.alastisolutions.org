"use server";

import db from "@/db/drizzle";
import { threads } from "@/db/schema";
import { getFrauditBySlug } from "../fraudit";
import { eq } from "drizzle-orm";

export const getFrauditThreads = async (slug: string) => {
  const fraudit = await getFrauditBySlug(slug);

  if (!fraudit) {
    throw new Error("Fraudit not found");
  }

  const data = await db.query.threads.findMany({
    where: eq(threads.frauditId, fraudit.id),
    orderBy: (fraudits, { desc }) => [desc(fraudits.updatedAt)],
    with: {
      comments: {
        orderBy: (comments, { desc }) => [desc(comments.updatedAt)],
      },
      user: {
        columns: {
          id: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return data;
};
