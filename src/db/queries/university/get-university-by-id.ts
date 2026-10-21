"use server";

import db from "@/db/drizzle";
import { universities } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUniversityById = async (id: string) => {
  console.log(id);
  try {
    const data = await db.query.universities.findFirst({
      where: eq(universities.id, id),
    });

    if (!data) {
      throw new Error("University not found");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("An Error has occurred, please try again.");
  }
};
