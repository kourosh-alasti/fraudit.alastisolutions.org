"use server";

import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { and, eq } from "drizzle-orm";

interface Props {
  uniId: string;
  courseAbbr: string;
  courseNumber: string;
}

export const getCourseByUniIdAndCourseNumber = async ({
  uniId,
  courseAbbr,
  courseNumber,
}: Props) => {
  try {
    const data = await db.query.courses.findFirst({
      where: and(
        eq(courses.universityId, uniId),
        eq(courses.abbreviation, courseAbbr),
        eq(courses.courseNumber, courseNumber),
      ),
      with: {
        professorsToCourses: true,
        university: true,
        reviews: true,
      },
    });

    if (!data) {
      throw new Error("Course not found");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("An Error has occurred, please try again.");
  }
};
