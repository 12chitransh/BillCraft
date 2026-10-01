import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">
              Bill<span className="text-orange-500">Craft</span>
            </h2>

            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-sm">
              Simple and smart invoicing for freelancers, creators, and
              growing businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 mt-4">
              <a
                href="/#features"
                className="text-sm text-gray-400 hover:text-orange-500 transition"
              >
                Features
              </a>

              <Link
                to="/how-it-works"
                className="text-sm text-gray-400 hover:text-orange-500 transition"
              >
                How It Works
              </Link>

              <a
                href="/#testimonials"
                className="text-sm text-gray-400 hover:text-orange-500 transition"
              >
                Testimonials
              </a>

              <a
                href="/#faq"
                className="text-sm text-gray-400 hover:text-orange-500 transition"
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white">
              Contact
            </h3>

            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-400">
                support@billcraft.com
              </p>

              <p className="text-sm text-gray-400">
                India
              </p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BillCraft. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-300 transition"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-300 transition"
            >
              Terms
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;