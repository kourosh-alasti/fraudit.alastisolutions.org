"use server";

import db from "@/db/drizzle";
import { professors } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export const getProfessorsByQuery = async (query: string) => {
  try {
    const data = await db.query.professors.findMany({
      where: or(
        ilike(professors.firstName, query),
        ilike(professors.lastName, query),
      ),
      with: {
        reviews: true,
        university: true,
      },
    });

    if (!data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Could not fetch professors, please try again.");
  }
};
