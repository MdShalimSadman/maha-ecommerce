"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Music2,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const contactDetails = [
    {
      icon: <MapPin size={18} className="text-[#7C4A4A]" />,
      text: "Fatullah, Narayanganj, Bangladesh",
    },
    {
      icon: <Phone size={18} className="text-[#7C4A4A]" />,
      text: "+880 1988-173043",
      link: "tel:+8801988173043",
    },
    {
      icon: <Mail size={18} className="text-[#7C4A4A]" />,
      text: "mahaa.modest@gmail.com",
      link: "mailto:mahaa.modest@gmail.com",
    },
  ];

  const informationLinks = [
    { name: "Returns and Exchange", href: "/return-exchange" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Track Your Order", href: "/track-order" },
  ];

  const categoryLinks = [
    { name: "Modest Gowns", href: "/category/modest-gown" },
    { name: "Hijabs", href: "/category/hijab" },
    { name: "Abayas", href: "/category/abaya" },
    { name: "Sale", href: "/sale" },
    { name: "New In", href: "/new-in" },
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, href: "#", label: "Facebook" },
    { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
    { icon: <Music2 size={18} />, href: "#", label: "TikTok" },
    { icon: <Youtube size={18} />, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="w-full bg-white text-gray-700 pt-10 pb-5 px-4 md:px-8 border-t">
      <div className="mx-auto flex flex-col md:flex-row gap-4 justify-between">
        {/* Contact Us */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-[#7C4A4A]">
            Contact Us
          </h2>
          {contactDetails.map((item, index) => (
            <div key={index} className="flex items-start gap-2 mb-2 last:mb-0">
              {item.icon}
              {item.link ? (
                <Link href={item.link} className="text-sm cursor-pointer">
                  {item.text}
                </Link>
              ) : (
                <p className="text-sm">{item.text}</p>
              )}
            </div>
          ))}
        </div>

        {/* Information */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-[#7C4A4A]">
            Information
          </h2>
          <ul className="space-y-2 text-sm">
            {informationLinks.map((link, index) => (
              <li
                key={index}
                className="hover:scale-105 transition-all duration-100"
              >
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-[#7C4A4A]">
            Categories
          </h2>
          <ul className="space-y-2 text-sm">
            {categoryLinks.map((link, index) => (
              <li
                key={index}
                className="hover:scale-105 transition-all duration-100"
              >
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-[#7C4A4A]">
            Social Medias
          </h2>
          <div className="flex items-center gap-4 mt-2">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="p-2 border border-[#7C4A4A] text-[#7C4A4A] rounded-full hover:bg-[#7C4A4A] hover:text-white transition"
                aria-label={social.label}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-5">
        Copyright © 2025 MAHAA. All rights reserved
      </div>
    </footer>
  );
}
