"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Feedback {
  image: string;
  review: string;
  name: string;
  occupation: string;
}

const feedbacks: Feedback[] = [
  {
    image: "/images/customers/customer.jpg",
    review: "This product exceeded my expectations! Amazing quality and fast delivery. The packaging was secure and beautifully presented. Customer support was responsive and friendly. Highly recommended",
    name: "Marzia Sultana",
    occupation: "Software Engineer",
  },
  {
    image: "/images/customers/customer-2.jpg",
    review: "Fantastic service and very reliable. I highly recommend it to everyone. The product quality is excellent, and it met all my expectations. Delivery was fast and hassle-free, and the team was attentive to every detail.",
    name: "Bilkis Khatun",
    occupation: "Designer",
  },
  {
    image: "/images/customers/customer-3.jpg",
    review: "A seamless experience from start to finish. Absolutely love it! The product arrived exactly as described and works perfectly. The team clearly cares about quality and customer satisfaction, which made the purchase very enjoyable.",
    name: "Sokhina Begum",
    occupation: "Marketing Specialist",
  },
];


export default function CustomerFeedback() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full max-w-5xl py-12 px-4 mx-auto">
      <h2 className="text-center font-semibold text-2xl md:text-4xl text-[#A6686A] mb-12">
        What Our Customers Say
      </h2>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {feedbacks.map((feedback, index) => (
            <CarouselItem key={index}>
              <div className="flex flex-col md:flex-row items-center">
                {/* Customer Image */}
                <div className="flex-shrink-0 w-32 h-32 md:w-56 md:h-56 relative md:-mr-12 -mb-20 md:mb-0 z-10">
                  <Image
                    src={feedback.image}
                    alt={feedback.name}
                    fill
                    priority
                    className="rounded-full border-8 border-[#EFD8D6] object-cover"
                  />
                </div>

                {/* Review Content */}
                <div className="flex-1 py-4">
                  <div className="bg-[#EFD8D6] rounded-l-lg md:rounded-l-none rounded-r-lg pr-4 pl-4 text-center md:text-start py-4 pt-20 md:pt-4 md:pl-16">
                    <p className="text-gray-700 text-base mb-4">
                      &quot;{feedback.review}&quot;
                    </p>
                    <h3 className="text-lg md:text-xl font-semibold">
                      {feedback.name}
                    </h3>
                    <p className="text-gray-500 text-sm md:text-base">
                      {feedback.occupation}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 gap-2">
        {feedbacks.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
              current === index ? "bg-[#7C4A4A]" : "bg-[#7C4A4A]/40"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}