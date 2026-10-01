import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle,
  Zap,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-white pt-20">

      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />

        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-100px)]">

          {/* ================= LEFT CONTENT ================= */}
          <div className="max-w-2xl">

            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Invoice Generation
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.05]">
              Create invoices
              <span className="block mt-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                smarter & faster.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-gray-500 max-w-xl">
              Generate professional invoices in seconds with the power of AI.
              Create, manage, and track your invoices without the boring
              paperwork.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />

                Create Your First Invoice

                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:border-orange-200 hover:bg-orange-50 transition-all duration-300"
              >
                See How It Works
              </Link>

            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free to get started
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Zap className="w-4 h-4 text-orange-500" />
                Generate in seconds
              </div>

            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="relative hidden lg:block">

            {/* Glow */}
            <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full scale-75" />

            {/* Invoice Card */}
            <div className="relative">

              {/* Floating AI Badge */}
              <div className="absolute -top-8 -left-8 z-20 flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-xl border border-gray-100 animate-bounce">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    AI Assistant
                  </p>

                  <p className="text-sm font-semibold text-gray-800">
                    Invoice ready!
                  </p>
                </div>
              </div>

              {/* Invoice */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-gray-900/10 p-8 rotate-1 hover:rotate-0 transition-transform duration-500">

                {/* Invoice Header */}
                <div className="flex items-start justify-between pb-6 border-b border-gray-100">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        BillCraft
                      </h3>

                      <p className="text-xs text-gray-400">
                        AI Invoice Platform
                      </p>
                    </div>

                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      INVOICE
                    </p>

                    <p className="font-semibold text-gray-800">
                      #INV-2026
                    </p>
                  </div>

                </div>

                {/* Customer */}
                <div className="grid grid-cols-2 gap-6 py-6">

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      BILL TO
                    </p>

                    <p className="font-semibold text-gray-800">
                      John Smith
                    </p>

                    <p className="text-sm text-gray-400">
                      john@example.com
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">
                      DATE
                    </p>

                    <p className="font-semibold text-gray-800">
                      Aug 17, 2026
                    </p>
                  </div>

                </div>

                {/* Invoice Items */}
                <div className="space-y-4">

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">
                        Web Development
                      </p>

                      <p className="text-xs text-gray-400">
                        1 × $1,200
                      </p>
                    </div>

                    <p className="font-semibold text-gray-800">
                      $1,200
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">
                        UI/UX Design
                      </p>

                      <p className="text-xs text-gray-400">
                        1 × $600
                      </p>
                    </div>

                    <p className="font-semibold text-gray-800">
                      $600
                    </p>
                  </div>

                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-end justify-between">

                  <div>
                    <p className="text-xs text-gray-400">
                      TOTAL
                    </p>

                    <p className="text-3xl font-bold text-gray-900">
                      $1,800
                    </p>
                  </div>

                  <div className="px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                    Ready
                  </div>

                </div>

              </div>

              {/* Floating Notification */}
              <div className="absolute -bottom-6 -right-6 px-5 py-4 bg-gray-900 text-white rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Invoice status
                    </p>

                    <p className="text-sm font-semibold">
                      Successfully created
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;