"use server";

import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getCourseById = async (id: string) => {
  try {
    const data = await db.query.courses.findFirst({
      where: eq(courses.id, id),
      with: {
        university: true,
      },
    });

    if (!data) {
      throw new Error("Course not found");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Could not fetch course, please try again.");
  }
};
