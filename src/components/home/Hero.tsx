"use client";

import * as React from "react";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    image: "/images/hero/third-image.jpg",
    title: "New Collection",
    subtitle: "Discover the latest trends",
  },
  {
    image: "/images/hero/second-image.jpg",
    title: "Summer Sale",
    subtitle: "Up to 50% off selected items",
  },
  {
    image: "/images/hero/first-image.png",
    title: "Premium Quality",
    subtitle: "Crafted with excellence",
  },
];

const Hero = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[97vh] md:h-[500px] lg:h-[600px] w-full">
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center text-white space-y-4 px-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-balance">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 text-white cursor-pointer" />
      <CarouselNext className="right-4 text-white cursor-pointer" />
    </Carousel>
  );
};

export default Hero;
