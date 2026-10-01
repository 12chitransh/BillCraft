import {
  Star,
  Quote,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Freelance Web Developer",
      location: "Bengaluru, India",
      avatar: "AS",
      rating: 5,
      review:
        "BillCraft has completely changed the way I handle invoices. I can create a professional invoice in just a few seconds instead of spending 15–20 minutes doing it manually.",
    },
    {
      name: "Priya Mehta",
      role: "Digital Marketing Consultant",
      location: "Mumbai, India",
      avatar: "PM",
      rating: 5,
      review:
        "The dashboard is my favourite part. I can instantly see my pending invoices, paid invoices and overall revenue. It makes managing my freelance business much easier.",
    },
    {
      name: "Rohan Verma",
      role: "Small Business Owner",
      location: "Delhi, India",
      avatar: "RV",
      rating: 5,
      review:
        "I used to maintain invoices manually in spreadsheets. BillCraft made everything much simpler. Creating and tracking invoices now takes only a few clicks.",
    },
    {
      name: "Sneha Iyer",
      role: "UI/UX Designer",
      location: "Pune, India",
      avatar: "SI",
      rating: 5,
      review:
        "The interface is clean, simple and very easy to understand. I especially love the smart reminders because I don't have to worry about forgetting pending payments.",
    },
    {
      name: "Aditya Patel",
      role: "Startup Founder",
      location: "Ahmedabad, India",
      avatar: "AP",
      rating: 5,
      review:
        "BillCraft feels like it was built for modern businesses. It saves me time every week and gives me a much better overview of my billing.",
    },
    {
      name: "Kavya Nair",
      role: "Content Creator",
      location: "Kochi, India",
      avatar: "KN",
      rating: 5,
      review:
        "As someone who works with multiple clients, keeping track of invoices was becoming difficult. BillCraft keeps everything organized in one place.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative py-24 overflow-hidden bg-white"
    >
      {/* Background */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-50 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="text-center max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Loved by Businesses
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            What our users
            <span className="block mt-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              are saying
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            From freelancers to growing businesses, BillCraft helps people
            save time and manage their invoices effortlessly.
          </p>

        </div>

        {/* ================= TESTIMONIAL CARDS ================= */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">

          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative"
            >

              {/* Glow */}
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-orange-400/20 to-orange-600/10 blur opacity-0 group-hover:opacity-100 transition duration-500" />

              {/* Card */}
              <div className="relative h-full p-7 rounded-3xl bg-white border border-gray-200 shadow-sm group-hover:shadow-xl group-hover:shadow-orange-500/10 group-hover:-translate-y-1 transition-all duration-300">

                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-orange-400" />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map(
                    (_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="w-4 h-4 fill-orange-400 text-orange-400"
                      />
                    )
                  )}
                </div>

                {/* Review */}
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  "{testimonial.review}"
                </p>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-6" />

                {/* User */}
                <div className="flex items-center gap-4">

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
                    {testimonial.avatar}
                  </div>

                  {/* User Info */}
                  <div className="min-w-0">

                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>

                    <p className="text-xs text-gray-400 mt-0.5">
                      {testimonial.location}
                    </p>

                  </div>

                </div>

                {/* Verified */}
                <div className="mt-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Verified User
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* ================= BOTTOM STAT ================= */}

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">

          <div className="flex items-center gap-3">

            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                AS
              </div>

              <div className="w-9 h-9 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                PM
              </div>

              <div className="w-9 h-9 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                RV
              </div>

              <div className="w-9 h-9 rounded-full bg-gray-800 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                +
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span className="font-bold text-gray-900">
                  4.9/5
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Loved by freelancers & businesses
              </p>
            </div>

          </div>

          <div className="hidden sm:block w-px h-10 bg-gray-200" />

          <a
            href="/signup"
            className="group flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
          >
            Start using BillCraft

            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;