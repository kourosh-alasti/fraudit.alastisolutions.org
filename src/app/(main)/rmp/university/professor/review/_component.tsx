"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { courses, professors } from "@/db/schema";
import { getCoursesByProfessor } from "@/db/queries/courses/get-courses-by-professor";
import { Loader2 } from "lucide-react";
import { getProfessorById } from "@/db/queries/professors/get-professor-by-id";
import { Input } from "@/components/ui/input";
import StarRatings from "react-star-ratings";
import { Label } from "@/components/ui/label";
import { createReview } from "@/actions/rmp/reviews/create-review";

const FormSchema = z.object({
  courseId: z.string({ error: "You must select a course" }),
  comment: z.string({
    error: "You must leave a comment for your review",
  }),
});

const ProfessorReviewComponent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const profId = searchParams.get("id") as string;

  const [starRating, setStarRating] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [prof, setProf] = useState<typeof professors.$inferSelect>();
  const [profCourses, setProfCourses] = useState<
    (typeof courses.$inferSelect)[]
  >([]);

  useEffect(() => {
    setLoading(true);
    const getData = () => {
      getProfessorById(profId)
        .then((res) => {
          setProf(res);
        })
        .catch((err) => console.error(err));

      getCoursesByProfessor(profId)
        .then((res) => {
          setProfCourses(res);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    };

    getData();
    router.refresh();
  }, [profId]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      courseId: "",
      comment: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createReview({
      profId: profId,
      courseId: data.courseId,
      comment: data.comment,
      rating: starRating,
    })
      .then((res) =>
        toast({
          title: "Success",
          description: "Your review has been successfully submitted",
          variant: "success",
        }),
      )
      .catch((err) =>
        toast({
          title: "An Error Occured",
          description: err.message || "Please try again later.",
          variant: "destructive",
        }),
      );

    router.push(`/rmp/university/professor/${profId}`);
  }

  function change(rate: number) {
    setStarRating(rate);
  }

    return (
        <>
         {loading && (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      )}
      {!loading && profCourses && prof && (
        <div className="mx-auto flex w-full flex-col lg:max-w-[968px]">
          <Card>
            <CardHeader>
              <h1 className="text-xl font-extrabold tracking-wide md:text-2xl lg:text-3xl">
                Post a new Review for{" "}
                <span className="underline underline-offset-2">
                  {prof?.firstName + " " + prof?.lastName}
                </span>
              </h1>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    name="courseId"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified course" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {profCourses.map((i) => (
                              <SelectItem key={i.id} value={i.id}>
                                {`${i.abbreviation} ${i.courseNumber}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="comment"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Review" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <Label>Professor Rating</Label>
                      <StarRatings
                        rating={starRating}
                        changeRating={change}
                        starRatedColor="green"
                        starEmptyColor="gray"
                        starHoverColor="lightblue"
                        numberOfStars={5}
                        starDimension="16px"
                      />
                    </div>

                    <Button type="submit">Post Review</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
      </>
    )
}

export default ProfessorReviewComponent