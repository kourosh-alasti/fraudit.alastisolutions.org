"use server";

import db from "@/db/drizzle";
import { courses, professorsToCourses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { truncate } from "fs";

export const getCoursesByProfessor = async (id: string) => {
  try {
    const relations = await db.query.professorsToCourses.findMany({
      where: eq(professorsToCourses.professorId, id),
    });

    let courseIds: string[] = [];
    let allCourses: (typeof courses.$inferSelect)[] = [];

    relations.forEach(async (relation) => {
      courseIds.push(relation.courseId!);
    });

    courseIds.forEach(async (i) => {
      const c = await db.query.courses.findFirst({
        where: eq(courses.id, i),
      });

      if (c) {
        allCourses.push(c);
      }
    });

    return allCourses;
  } catch (error) {
    console.error(error);
    throw new Error("An Error has occurred, please try again.");
  }
};
