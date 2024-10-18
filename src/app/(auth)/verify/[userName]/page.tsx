"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { BackgroundLines } from "@/components/ui/background-lines";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function VerifyAccount() {
  const router = useRouter();
  const paramsData = useParams<{ userName: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  //fetching data after submiting
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-otp`, {
        userName: paramsData.userName,
        otp: data.code,
      });

      toast({
        title: "OTP verified Successfully",
        description: response.data.message,
        variant: "default",
      });

      router.replace(`/sign-in`);
    } catch (error) {
      const axioserror = error as AxiosError<ApiResponse>;
      let errorMsg = axioserror.response?.data.message;
      toast({
        title: "OTP Veification Failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 h-screen bg-slate-900">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg z-10 shadow-lg">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="font-semibold">
              Enter the verification code sent to you
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium tracking-tight">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="otp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full text-center relative inline-flex h-12 overflow-hidden p-[1px] rounded-full focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 font-medium text-white backdrop-blur-3xl text-lg  ">
                  Verify Me👍
                </span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </BackgroundLines>
  );
}

export default VerifyAccount;
