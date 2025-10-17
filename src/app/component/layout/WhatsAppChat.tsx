"use client";

import Image from "next/image";
import Link from "next/link";

const WhatsAppChat = () => {
  return (
    <Link
      href="https://wa.me/8801988173043"
      target="_blank"
      rel="noopener noreferrer"
      className="!z-50 fixed bottom-0 transform -translate-y-1/2 right-3"
    >
      <Image
        src="/images/layout/whatsapp-logo.svg"
        width={50}
        height={50}
        priority
        alt="whatsapp"
        className="cursor-pointer !z-50"
      />
    </Link>
  );
};

export default WhatsAppChat;
