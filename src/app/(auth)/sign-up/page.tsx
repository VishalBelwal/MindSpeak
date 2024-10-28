"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [userName, setuserName] = useState("");
  const [nameMessage, setnameMessage] = useState("");
  const [isCheckingUserName, setisCheckingUserName] = useState(false);
  const [isSubmitted, setisSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  //debouncing
  const debouncedUserName = useDebounceCallback(setuserName, 300);

  //zod
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  //debouncing ke baad ek request jayegi jo check karegi username
  useEffect(() => {
    const checkUniqueName = async () => {
      if (userName) {
        setisCheckingUserName(true);
        setnameMessage("");

        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-unique-username?userName=${userName}`
          );
          setnameMessage(response.data.message);
          console.log(response.data.message);
        } catch (error) {
          const axioserror = error as AxiosError<ApiResponse>;
          setnameMessage(
            axioserror.response?.data.message ?? "Error finding username"
          );
        } finally {
          setisCheckingUserName(false);
        }
      }
    };
    checkUniqueName();
  }, [userName]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitted(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
        variant: "default",
      });
      // router.replace(`/verify/${userName}`);
      router.replace(`/sign-in`);
      setisSubmitted(false)
    } catch (error) {
      console.error("Error in signup of user", error);
      const axioserror = error as AxiosError<ApiResponse>;
      let errorMsg = axioserror.response?.data.message;
      toast({
        title: "Signup Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setisSubmitted(false);
    }
    // console.log(data);
  };

  return (
    <>
      <div className="flex justify-center items-center bg-slate-900 h-screen w-screen absolute overflow-hidden ">
        <div className="w-full max-w-md p-8 space-y-8 bg-[#e7d9b2] rounded-lg shadow-lg z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Welcome to MindSpeak
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="userName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="border-black placeholder:text-black placeholder:font-medium"
                        placeholder="Enter Here"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedUserName(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUserName && <Loader2 className="animate-spin" />}
                    <p
                      className={`text-sm font-semibold ${
                        nameMessage === "Username's Unique"
                          ? "text-indigo-800"
                          : "text-red-500"
                      }`}
                    >
                      {nameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@domain.com"
                        className="border-black placeholder:text-black placeholder:font-medium"
                        {...field}
                      />
                    </FormControl>
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
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter Here"
                        className="border-black placeholder:text-black placeholder:font-medium"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full text-center "
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "SignUp"
                )}
              </Button>
              <div className="text-center">
                <h3>
                  Already a member?{" "}
                  <Link
                    href="/sign-in"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Sign in Now
                  </Link>
                </h3>
              </div>
            </form>
          </Form>
        </div>
        <div className="absolute inset-0 w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
      </div>
    </>
  );
}
