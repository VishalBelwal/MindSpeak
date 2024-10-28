"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

function SigninPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  const word = [
    {
      text: "MindSpeak",
    }
  ];

  return (
    <div className="h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="flex justify-center items-center text-white z-10">
        <div className="w-full max-w-lg p-2 space-y-8 ">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Welcome <br /> to
            </h1>
            <div className="flex  -mt-3  justify-center">
              <TypewriterEffectSmooth className=" text-4xl tracking-tight lg:text-5xl font-extrabold" words={word} />
            </div>
            <p className="mb-4 text-teal-500">
              Sign in to continue your secret conversations
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <Input
                      {...field}
                      placeholder="Enter Here"
                      className="text-white"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Enter Here"
                      className="text-white"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full text-md font-semibold rounded-md bg-teal-500 text-white  transition duration-200 hover:bg-white hover:text-black "
                type="submit"
              >
                Sign In
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Not a member yet?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800 font-semibold "
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

export default SigninPage;
