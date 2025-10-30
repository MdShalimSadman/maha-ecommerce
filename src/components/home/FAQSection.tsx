"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery. Items must be unused and in original packaging.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days. Expedited shipping options are available at checkout.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries. Shipping fees and delivery times may vary depending on your location.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking number via email to track your package.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "Orders can be changed or canceled within 2 hours of placing them. Please contact our support team immediately.",
  },
];

const FAQSection = () => {
  return (
    <section className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-center font-semibold text-2xl md:text-4xl text-[#A6686A]">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="mt-12 space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="bg-[#A6686A] text-white px-3 rounded-lg">
            <AccordionTrigger className="cursor-pointer " iconClassName="text-white w-4 border rounded-full h-4 flex items-center justify-center">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;
