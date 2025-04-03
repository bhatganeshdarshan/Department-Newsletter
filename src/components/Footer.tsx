import { Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-100 via-white to-pink-100 py-8 mt-8">
      <div className="container mx-auto px-4">
        {/* Top Section: Credits & Thanks */}
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          {/* Left Content */}
          <div className="mb-6 md:mb-0">
            <p className="text-md font-medium text-gray-700 tracking-wide mb-2">
              Created by{" "}
              <span className="mx-1 font-semibold text-pink-600">Ganeshdarshan Bhat</span>
              and
              <span className="mx-1 font-semibold text-pink-600">K Sai Geethanjali</span>,
              Department of AI&ML
            </p>
            <p className="text-sm text-gray-600">
              Thank you to our HOD{" "}
              <span className="font-semibold text-pink-600">Anupama H S</span> and
              faculty coordinator{" "}
              <span className="font-semibold text-pink-600">Dr Rajesh I S</span> for
              their guidance and support.
            </p>
          </div>

          {/* Right Content (Social Icons) */}
          <div className="flex space-x-5 justify-center md:justify-end">
            {/*  */}
            <a
              href="https://www.linkedin.com/school/bms-institute-of-technology-and-management/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            {/*  */}
          </div>
        </div>

        {/* Bottom Section: Divider & Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            © 2023 BMSIT&M - Department of AI&ML. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
