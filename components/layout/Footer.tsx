import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}

          <div>

            <div className="flex items-center gap-3">

              <Image
                src="/logo/xareon1-logo.png"
                alt="XAREON GROUP"
                width={60}
                height={60}
                className="rounded-full"
              />

              <div>

                <h3 className="text-xl font-bold text-white">
                  XAREON GROUP
                </h3>

                <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
                  SHIELD OF INTEGRITY
                </p>

              </div>

            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Professional Home Repair & Installation Services
              serving Maryland, Washington DC and Northern Virginia.
            </p>

          </div>

          {/* Navigation */}

          <div>

            <h4 className="mb-4 text-lg font-semibold text-white">
              Navigation
            </h4>

            <div className="flex flex-col gap-3">

              <Link href="/" className="text-slate-400 hover:text-blue-400">
                Home
              </Link>

              <Link href="#services" className="text-slate-400 hover:text-blue-400">
                Services
              </Link>

              <Link href="#portfolio" className="text-slate-400 hover:text-blue-400">
                Portfolio
              </Link>

              <Link href="#reviews" className="text-slate-400 hover:text-blue-400">
                Reviews
              </Link>

              <Link href="/blog" className="text-slate-400 hover:text-blue-400">
                Blog
              </Link>

              <Link href="#contact" className="text-slate-400 hover:text-blue-400">
                Contact
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h4 className="mb-4 text-lg font-semibold text-white">
              Contact
            </h4>

            <div className="space-y-4">

              <a
                href="tel:+12022868497"
                className="flex items-center gap-3 text-slate-400 hover:text-blue-400"
              >
                <Phone size={18} />
                (202) 286-8497
              </a>

              <a
                href="mailto:info@xareongroup.com"
                className="flex items-center gap-3 text-slate-400 hover:text-blue-400"
              >
                <Mail size={18} />
                info@xareongroup.com
              </a>

              <div className="flex items-start gap-3 text-slate-400">

                <MapPin size={18} className="mt-1" />

                <span>
                  Serving
                  <br />
                  Maryland
                  <br />
                  Washington DC
                  <br />
                  Northern Virginia
                </span>

              </div>

            </div>

          </div>

          {/* CTA */}

          <div>

            <h4 className="mb-4 text-lg font-semibold text-white">
              Need Help?
            </h4>

            <p className="text-sm leading-7 text-slate-400">
              Contact XAREON GROUP today for reliable home repair,
              installation and smart home services.
            </p>

            <a
              href="tel:+12022868497"
              className="mt-6 inline-flex w-full justify-center rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              📞 Call Now
            </a>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-12 border-t border-slate-800 pt-6 text-center">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} XAREON GROUP.
            All Rights Reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}
