import Link from "next/link";
import Image from "next/image";
import MobileNav from "./MobileNav";
import { primaryNav, siteConfig } from "@/lib/content";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-hairline bg-surface">
            <Image
              src="https://reallyfelawyer.online/wp-content/uploads/2026/07/RealLyfeLawyer_HeadLogo_Bk-2.png"
              alt=""
              fill
              sizes="36px"
              className="object-cover"
            />
          </span>
          <span className="font-sans text-lg font-bold text-white">
            RealLyfe<span className="text-primary"> Lawyer</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-body transition-colors hover:text-white"
                >
                  {item.label}
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3 text-muted transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="invisible absolute left-0 top-full w-56 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-hairline bg-surface p-2 shadow-xl">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-body transition-colors hover:bg-canvas hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-body transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.phone_tel_link}
            className="hidden rounded-full bg-gold-gradient px-5 py-2 text-sm font-bold text-canvas transition-opacity hover:opacity-90 sm:block"
          >
            {siteConfig.phone}
          </a>
          <MobileNav phoneTelLink={siteConfig.phone_tel_link} phone={siteConfig.phone} />
        </div>
      </div>
    </header>
  );
}
