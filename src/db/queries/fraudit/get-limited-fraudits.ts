"use server";

import db from "@/db/drizzle";
import { fraudits } from "@/db/schema";

const shuffle = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

export const getLimitedFraudits = async (lastDoc: number) => {
  const data = await db.query.fraudits.findMany({
    orderBy: [fraudits.memberCount],
    with: {
      owner: {
        columns: {
          id: true,
        },
      },
    },
    offset: lastDoc,
  });

  if (!data) {
    throw new Error("Error fetching fraudits");
  }

  return shuffle(data);
};
