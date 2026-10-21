'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createThread } from "@/actions/fraudit";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { ForwardedEditor } from "@/components/editor";
import { Suspense, useState } from "react";

interface Props {
    slug: string;
  }
  
  const formSchema = z.object({
    title: z
      .string({ error: "A Title is required to post a thread" })
      .min(6, { message: "Best Practices to have a well-defined title" }),
  });

const CreateThreadComponent = () => {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug") as string;
  
    const [content, setContent] = useState<string>("Edit Me!");
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
      },
    });
  
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      await createThread({
        title: values.title,
        content: content,
        frauditSlug: slug,
      })
        .then(() => {
          toast({
            title: "Success",
            description: "Successfully posted a new thread",
            variant: "success",
          });
          router.push(`/app/f/${slug}`);
        })
        .catch((err) =>
          toast({
            variant: "destructive",
            title: "An Error has occurred",
            description:
              err.message || "Failed to post new thread, please try again later",
          }),
        );
    };
  
    const onEditorChange = (text: string) => {
      setContent(text);
    };
  

    return (
    <div className="mx-auto lg:max-w-[968px]">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-extrabold tracking-wide md:text-2xl lg:text-3xl">
              Post a new Thread
            </h1>
          </CardHeader>
          <CardContent>
            <Form {...form}>
            <Suspense>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thread Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Help Needed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ForwardedEditor markdown={content} onChange={onEditorChange} />
                <Button type="submit" className="bg-green-500 text-slate-700">
                  Post
                </Button>
              </form>
            </Suspense>
            </Form>
          </CardContent>
        </Card>
      </div>
      )
}

export default CreateThreadComponent