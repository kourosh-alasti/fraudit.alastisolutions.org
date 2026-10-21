"use server";

import db from "@/db/drizzle";
import { professors } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getProfessorById = async (id: string) => {
  try {
    const data = await db.query.professors.findFirst({
      where: eq(professors.id, id),
      with: {
        professorsToCourses: true,
        reviews: true,
        university: true,
      },
    });

    if (!data) {
      throw new Error("Professor not found");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Could not fetch professor information, please try again.");
  }
};
