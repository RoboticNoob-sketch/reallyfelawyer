import Link from "next/link";
import Image from "next/image";
import SocialIcons from "./SocialIcons";
import { footerNav, siteConfig } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas pb-16 md:pb-0">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div>
            <Link href="/" className="inline-flex flex-col items-start gap-4">
              <span className="relative h-36 w-36 overflow-hidden rounded-full border border-gold/30 bg-canvas">
                <Image
                  src="https://reallyfelawyer.online/wp-content/uploads/2026/07/RealLyfeLawyer_HeadLogo_Bk-2.png"
                  alt="RealLyfe Lawyer"
                  fill
                  sizes="144px"
                  className="object-contain"
                />
              </span>
              <span className="text-lg font-bold text-white">
                RealLyfe<span className="text-primary"> Lawyer</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Birth injury, medical malpractice, mass torts &amp; accident attorney.
              Licensed in TX, OK, NM &amp; AZ.
            </p>
            <div className="mt-4 space-y-1 text-sm text-body">
              <p>
                <a href={siteConfig.phone_tel_link} className="hover:text-white">
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </p>
              <p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-white"
                >
                  {siteConfig.address}
                </a>
              </p>
            </div>
            <SocialIcons className="mt-6" />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerNav.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-bold text-white">{col.title}</p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-hairline bg-surface p-6 sm:flex-row sm:items-center">
          <p className="text-sm font-bold text-white">
            Free, confidential case review. No fee unless we win.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-bold text-canvas transition-opacity hover:opacity-90"
            >
              Get My Free Case Review
            </Link>
            <a
              href={siteConfig.phone_tel_link}
              className="inline-block rounded-full border border-hairline px-5 py-2.5 text-sm font-bold text-white transition-colors hover:border-primary"
            >
              Call {siteConfig.phone}
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-hairline pt-6 text-xs text-muted">
          <p>
            Attorney Advertising. Prior results do not guarantee a similar outcome. This
            website provides general information, not legal advice, and does not create
            an attorney-client relationship.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {siteConfig.site_title}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
