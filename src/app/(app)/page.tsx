"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Mail } from "lucide-react";
import React from "react";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Navbar from "@/components/custom-ui/navbar";

const HomePage = () => {

  const words2 = [
    { text: "MindSpeak",className: "bg-clip-text bg-gradient-to-r text-purple-400" },
    { text: "-",className: "bg-clip-text bg-gradient-to-r text-purple-400" },
    { text: "Say",className: "bg-clip-text bg-gradient-to-r text-purple-400"  },
    { text: "anything",className: "bg-clip-text bg-gradient-to-r text-purple-500" },
    { text: "you",className: "bg-clip-text bg-gradient-to-r text-violet-500" },
    { text: "want, ",className: "bg-clip-text bg-gradient-to-r text-violet-500"},
    { text: "without",className: "bg-clip-text bg-gradient-to-r text-violet-500"  },
    { text: "revealing",className: "bg-clip-text bg-gradient-to-r text-pink-500" },
    { text: "your",className: "bg-clip-text bg-gradient-to-r text-pink-500" },
    { text: "true",className: "bg-clip-text bg-gradient-to-r text-pink-700" },
    { text: "Identity.",className: "bg-clip-text bg-gradient-to-r text-pink-700" },
  ];

  return (
    <div className="flex flex-col">
      <Navbar />
      <BackgroundBeamsWithCollision className="flex-grow">
        <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-48 bg-[#242424] text-slate-500">
          <section className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl mb-8 md:text-5xl font-bold">
              {/* <TypewriterEffect words={words} /> */}
              Dive into the World of Anonymous FeedBack...
            </h1>
            <div className=" bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 ">
              <p className="tracking-tight font-semibold">
                <TypewriterEffect className="text-sm" words={words2} />
              </p>
            </div>
          </section>
          {/* Carousel for Messages */}
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-lg md:max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default HomePage;
