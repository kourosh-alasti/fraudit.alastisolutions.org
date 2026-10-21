"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createFraudit } from "@/actions/fraudit";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string({ error: "A Title is required" })
    .min(6, { message: "Title Must be at least 6 characters" }),
  description: z
    .string({ error: "A Description is required" })
    .max(100, { message: "Description must be less than 100 characters" }),
  slug: z
    .string({ error: "A Slug is required" })
    .min(5, { message: "Slug Must be at least 5 characters" }),
});

const CreateFrauditPage = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createFraudit({ ...values })
      .then(() => {
        toast({
          title: "Success",
          description: "Congrats for creating a new Fraudit",
          variant: "success",
        });

        router.push("/app");
      })
      .catch((err) =>
        toast({
          variant: "destructive",
          title: "An Error Occured",
          description:
            err.message ||
            "Failed to create new Fraudit, please try again later.",
        }),
      );
  };

  return (
    <div className="mt:14 mx-auto lg:mt-20 lg:max-w-[968px]">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-extrabold tracking-wide md:text-2xl lg:text-3xl">
            Create A New Fraudit
          </h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fraudit Title</FormLabel>
                    <FormControl>
                      <Input placeholder="CoursesToTake" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fraudit Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A short sentence about your fraudit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fraudit Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="courses" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be the url to follow: f/courses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="flex flex-row-reverse"> */}
              <Button type="submit" className="bg-green-500 text-slate-700">
                Submit
              </Button>
              {/* <Button variant="ghost" className="text-rose-500">
                  Cancel
                </Button>
              </div> */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFrauditPage;
