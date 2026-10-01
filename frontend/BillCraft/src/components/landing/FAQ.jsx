import { useState } from "react";
import {
  ChevronDown,
  Sparkles,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the AI invoice creation work?",
      answer:
        "BillCraft uses AI to make invoice creation faster and easier. Simply provide details such as your customer information, products or services, quantities, and prices. BillCraft helps organize the information into a professional invoice that you can review and edit before sending.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes. You can get started with BillCraft without making a payment upfront. The free experience allows you to explore the core invoice creation and management features before deciding whether you need a paid plan.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes. You can upgrade or change your plan whenever your business needs change. Whether you're starting as a freelancer or growing into a larger business, you can choose the plan that works best for you.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "You can cancel your subscription whenever you want. Your access to paid features will continue according to the terms of your current billing period. We keep the cancellation process simple and transparent.",
    },
    {
      question: "Can other information be added to an invoice?",
      answer:
        "Absolutely. You can add additional information such as business details, customer information, invoice numbers, payment terms, tax information, notes, discounts, and other details required for your invoice.",
    },
    {
      question: "How does billing work?",
      answer:
        "Billing depends on the plan you choose. Subscription charges are handled through our payment system, and you can manage your billing information from your account. Your plan and billing details will always be clearly displayed.",
    },
    {
      question: "Can I edit an invoice after creating it?",
      answer:
        "Yes. You can edit your invoice details before sending or finalizing it. Update customer information, products, prices, taxes, notes, and other invoice details whenever necessary.",
    },
    {
      question: "Can I download or share my invoices?",
      answer:
        "Yes. Once your invoice is ready, you can download it and share it with your customers. This makes it easy to keep records and send professional invoices directly to your clients.",
    },
    {
      question: "Is my invoice data secure?",
      answer:
        "We take data security seriously. BillCraft is designed with security and privacy in mind so your business and invoice information can be handled safely. We continuously work to improve the security of the platform.",
    },
    {
      question: "Can I manage multiple invoices?",
      answer:
        "Yes. BillCraft allows you to manage multiple invoices from one dashboard. You can create, view, edit, organize, and track your invoices without having to maintain separate spreadsheets or files.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-24 overflow-hidden bg-gray-50"
    >
      {/* ================= BACKGROUND EFFECTS ================= */}

      <div className="absolute top-0 left-0 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="text-center max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Frequently Asked Questions
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Got questions?
            <span className="block mt-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              We've got answers.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            Everything you need to know about BillCraft, AI invoice creation,
            billing, plans, and managing your invoices.
          </p>
        </div>

        {/* ================= FAQ LIST ================= */}

        <div className="mt-14 space-y-4">

          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`group rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "bg-white border-orange-200 shadow-lg shadow-orange-500/10"
                    : "bg-white border-gray-200 hover:border-orange-200 hover:shadow-md"
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-6 p-5 sm:p-6 text-left"
                >
                  <div className="flex items-center gap-4">

                    {/* Number */}
                    <div
                      className={`hidden sm:flex shrink-0 w-10 h-10 rounded-xl items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isOpen
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                          : "bg-orange-50 text-orange-500 group-hover:bg-orange-100"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Question */}
                    <span
                      className={`text-base sm:text-lg font-semibold transition-colors ${
                        isOpen
                          ? "text-orange-600"
                          : "text-gray-800 group-hover:text-gray-900"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-orange-500 text-white rotate-180"
                        : "bg-gray-100 text-gray-500 group-hover:bg-orange-50 group-hover:text-orange-500"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 sm:pl-[88px] sm:pr-20">
                      <div className="h-px bg-gray-100 mb-5" />

                      <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* ================= BOTTOM HELP CARD ================= */}

        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-8 sm:p-10">

          {/* Glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Left */}
            <div className="flex items-center gap-5">

              <div className="w-14 h-14 shrink-0 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <HelpCircle className="w-7 h-7 text-orange-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-orange-400">
                  Still have questions?
                </p>

                <h3 className="mt-1 text-xl sm:text-2xl font-bold text-white">
                  We're here to help.
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Get in touch with our support team.
                </p>
              </div>

            </div>

            {/* Button */}
            <a
              href="mailto:support@billcraft.com"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </a>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQ;