"use client";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.email(),
});

export default function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      router.push("/success");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign up to our mailing list</CardTitle>
          <CardDescription>
            Be the first to hear about our events and more news!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your Email Address..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By subscribing to our mailing list, you agree to our{" "}
        <Link href={"/privacy-policy"}>Privacy Policy</Link>.
      </div>
    </div>
  );
}
