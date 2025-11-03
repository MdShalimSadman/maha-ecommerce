const Page = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-700">
      <h1 className="text-3xl font-semibold mb-6 text-[#7C4A4A]">
        Return & Exchange Policy
      </h1>
      <p className="mb-8">
        We want you to be fully satisfied with every purchase you make from us.
        If you are not completely happy with your order, we’re here to help with
        our simple and transparent return and exchange process.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#7C4A4A]">
          1. Eligibility for Returns
        </h2>
        <p>
          To be eligible for a return or exchange, items must be unused, in
          their original packaging, and in the same condition that you received
          them. Returns must be requested within <strong>7 days</strong> of
          receiving your order.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#7C4A4A]">
          2. Non-Returnable Items
        </h2>
        <p>
          Certain products cannot be returned or exchanged for hygiene or
          customization reasons. These include:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>Personalized or custom-made products</li>
          <li>Undergarments and hygiene-related items</li>
          <li>Sale or clearance items</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#7C4A4A]">
          3. Return & Exchange Process
        </h2>
        <p className="mb-3">
          To initiate a return or exchange, please follow these steps:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Contact our customer support team at{" "}
            <a
              href="mailto:support@example.com"
              className="text-[#7C4A4A] underline"
            >
              support@example.com
            </a>{" "}
            within 7 days of delivery.
          </li>
          <li>Provide your order number and a brief explanation for the return.</li>
          <li>Our team will review your request and share return instructions.</li>
          <li>
            Ship the item back to us using a reliable courier service. Please
            keep the tracking details for reference.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#7C4A4A]">
          4. Refunds
        </h2>
        <p>
          Once your returned item is received and inspected, we will notify you
          of the approval or rejection of your refund. Approved refunds will be
          processed to your original payment method within{" "}
          <strong>5–10 business days</strong>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#7C4A4A]">
          5. Exchanges
        </h2>
        <p>
          If you wish to exchange an item for a different size, color, or
          product, please mention it in your return request. Exchanges are
          subject to product availability. If unavailable, a refund will be
          issued instead.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#7C4A4A]">
          6. Damaged or Defective Items
        </h2>
        <p>
          If you receive a damaged or defective product, please contact us
          within <strong>48 hours</strong> of receiving the item. Include
          relevant photos and your order number. We’ll arrange a replacement or
          full refund depending on the situation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-[#7C4A4A]">
          7. Contact Us
        </h2>
        <p>
          For any questions or support related to returns or exchanges, please
          reach out to us at:{" "}
          <a
            href="mailto:support@example.com"
            className="text-[#7C4A4A] underline"
          >
            support@example.com
          </a>
        </p>
      </section>

      <p className="mt-10 text-sm text-gray-500">
        Last updated: November 1, 2025
      </p>
    </main>
  );
};

export default Page;
