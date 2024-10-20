"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  if (!messageString || !messageString.includes(specialChar)) {
    console.warn("No separator found or empty message string.");
    return ["Oops! No suggested messages available."];
  }
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const { username } = useParams();

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const [isLoading, setIsLoading] = useState(false);

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      if (response.status === 200) {
        toast({ title: response.data.message, variant: "default" });
        form.reset({ content: "" });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      await complete("suggested some message");
    } catch (error) {
      console.error("Error fetching messages:", error);
      return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
      );
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-[#DCD7C9] rounded-lg shadow-lg max-w-lg md:max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#2C3639]">
        Share Your Thoughts Anonymously
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your anonymous message here..."
                    className="resize-none border rounded-md focus:border-[#A27B5C] focus:ring-[#A27B5C]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button
                disabled
                className="bg-gray-400 text-white border-gray-600 cursor-not-allowed transition duration-200 ease-in-out transform"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-black text-white border cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
                disabled={isLoading || !messageContent?.trim()}
              >
                Send it
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2 text-center">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages from AI
          </Button>
          <p>Select a suggested message below to quickly add it!</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Suggested Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : completion && completion.includes(specialChar) ? (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 border-[#2C3639] text-[#2C3639] hover:bg-[#2C3639] hover:text-white transition duration-200 text-left w-full truncate"
                  onClick={() => handleMessageClick(message)}
                >
                  <span className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {message}
                  </span>
                </Button>
              ))
            ) : (
              <p className="text-gray-500">No suggested messages available.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <p className="mb-4">Join us to enhance your experience!</p>
        <Link href={"/sign-up"}>
          <Button className="bg-[#A27B5C] text-black border border-black hover:bg-[#A27B5C]/90">
            Create Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
