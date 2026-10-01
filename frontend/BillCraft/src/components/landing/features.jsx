import { useState } from "react";
import {
  Sparkles,
  LayoutDashboard,
  BellRing,
  FileText,
  ArrowUpRight,
} from "lucide-react";

const Features = () => {
  const [expanded, setExpanded] = useState(null);

  const features = [
    {
      icon: FileText,
      title: "AI Invoice Creation",
      description:
        "Create professional invoices in seconds. Let AI handle the details while you focus on your business.",
      details:
        "BillCraft uses AI to help you create clean and professional invoices quickly. Simply provide your customer and service details, and generate an invoice without spending time on manual formatting.",
      tag: "AI Powered",
    },

    {
      icon: LayoutDashboard,
      title: "AI-Powered Dashboard",
      description:
        "Get intelligent insights into your invoices, revenue, payments, and business performance.",
      details:
        "Your smart dashboard gives you a complete overview of your business. Track revenue, paid invoices, pending payments, total invoices, and other important information in one place.",
      tag: "Smart Insights",
    },

    {
      icon: BellRing,
      title: "Smart Reminders",
      description:
        "Never miss a payment. Automatically remind your clients about upcoming and overdue invoices.",
      details:
        "BillCraft helps you stay on top of unpaid invoices with smart payment reminders. Keep your clients informed and reduce the chances of missing important payments.",
      tag: "Automated",
    },

    {
      icon: Sparkles,
      title: "Easy Invoice Management",
      description:
        "Create, edit, track, and organize all your invoices from one simple and powerful workspace.",
      details:
        "Manage all your invoices from one simple workspace. Easily create new invoices, edit existing ones, check payment status, and keep your billing information organized.",
      tag: "Simple & Fast",
    },
  ];

  const handleLearnMore = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <section
      id="features"
      className="relative py-24 overflow-hidden bg-gray-50"
    >
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </div>

          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Everything you need to
            <span className="block mt-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              manage invoices smarter
            </span>
          </h2>

          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            BillCraft combines AI-powered automation with simple invoice
            management to help you save time and get paid faster.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">

          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isExpanded = expanded === index;

            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/30 to-orange-600/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

                {/* Card */}
                <div className="relative p-8 sm:p-10 rounded-3xl bg-white border border-gray-200 shadow-sm group-hover:shadow-xl group-hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden">

                  {/* Decorative Circle */}
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-50 rounded-full group-hover:scale-125 transition-transform duration-700" />

                  {/* Icon */}
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Tag */}
                  <div className="relative mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    {feature.tag}
                  </div>

                  {/* Title */}
                  <h3 className="relative mt-4 text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  {/* Main Description */}
                  <p className="relative mt-3 text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Expanded Description */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.details}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <button
                    onClick={() => handleLearnMore(index)}
                    className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    {isExpanded ? "Show less" : "Learn more"}

                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isExpanded
                          ? "rotate-180"
                          : "group-hover:translate-x-1 group-hover:-translate-y-1"
                      }`}
                    />
                  </button>

                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default Features;