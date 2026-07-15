import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <h3 className="text-2xl font-bold text-white">
              XAREON GROUP
            </h3>

            <p className="mt-4 leading-7">
              Professional Home Repair & Installation Services serving
              Maryland, Washington DC, and Northern Virginia.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-bold text-white">
              Services
            </h4>

            <ul className="space-y-3">
              <li>Home Repairs</li>
              <li>TV Mounting</li>
              <li>Painting</li>
              <li>Smart Home</li>
              <li>Furniture Assembly</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-bold text-white">
              Contact
            </h4>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>(202) 286-8497</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>info@xareongroup.com</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>Serving MD • DC • VA</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-bold text-white">
              Follow Us
            </h4>

            <div className="flex flex-col gap-3">
              <Link
                href="#"
                className="transition hover:text-white"
              >
                Facebook
              </Link>

              <Link
                href="#"
                className="transition hover:text-white"
              >
                Instagram
              </Link>

              <Link
                href="#"
                className="transition hover:text-white"
              >
                LinkedIn
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              Follow us for updates, completed projects, and home
              improvement tips.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} XAREON GROUP. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}