"use client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User.model";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageCard from "@/components/custom-ui/messageCard";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User } from "next-auth";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import Navbar from "@/components/custom-ui/navbar";

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-message");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing Latest Messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      // Handle the error appropriately here
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages, toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    fetchAllMessages();
  }, [session, setValue, fetchAcceptMessage, fetchAllMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <></>;
  }

  const { userName } = session?.user as User;
  const hostURL = `${window.location.protocol}//${window.location.host}`;
  const profileURL = `${hostURL}/u/${userName}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast({
      title: "URL Copied Successfully",
      description: "Profile URL copied successfully",
    });
  };

  return (
    <div className="relative min-h-screen text-white bg-neutral-900 flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl p-4 z-20">
          <h1 className="text-4xl font-bold mb-4 text-center tracking-tight">User Dashboard</h1>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-center">Copy Your Unique Link</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={profileURL}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button
                onClick={copyToClipboard}
                className="bg-white text-black hover:bg-white"
              >
                Copy
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="text-black outline outline-white mr-2"
              />
              <span className="font-bold">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
            </div>
            <Separator className="my-4" />
            <Button
              className="flex items-center justify-start"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchAllMessages(true);
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-black animate-spin" />
              ) : (
                <RefreshCcw className="h-4 text-black w-4" />
              )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={String(message._id)}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <p className="text-center font-semibold tracking-normal text-lg">No Messages to Display.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ShootingStars className="absolute inset-0 z-0" />
      <StarsBackground className="absolute inset-0 z-0" />
    </div>
  );
}

export default Dashboard;
