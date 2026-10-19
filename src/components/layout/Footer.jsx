import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-[#0B1528] text-white border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-14 md:pt-20 pb-10 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/[0.08]">
          {/* Brand & Overview Column */}
          <div className="lg:col-span-2 flex flex-col justify-between pr-0 lg:pr-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-[#0F1E36] flex items-center justify-center font-bold text-sm tracking-wider text-[#D6B46A] border border-[#D6B46A]/20">
                  F
                </div>
                <span className="text-[15px] sm:text-[17px] tracking-tight text-white font-semibold leading-snug">
                  FORTRESS OF INDUSTRIAL FASTENERS
                </span>
              </div>
              <p className="text-[14px] text-stone-400 leading-relaxed font-normal">
                Precision manufacturing, standard structural fasteners, and custom OEM drawing-to-part sourcing solutions. Engineering-grade hardware for infrastructure, automotive, and heavy mechanical deployments.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-stone-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D6B46A]"></span>
                  EN 10204 3.1 MTR Traceable
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D6B46A]"></span>
                  ISO 9001:2015 Certified
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col gap-1">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">
                Central Procurement Desk
              </span>
              <a
                href="tel:+917200979731"
                className="text-[20px] font-semibold text-[#D6B46A] hover:underline"
              >
                +91 72009 79731
              </a>
            </div>
          </div>

          {/* Catalogue Links */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider pb-2 border-b border-white/[0.08]">
              Catalogue
            </h3>
            <ul className="space-y-2.5 text-[13.5px] text-stone-400 font-normal">
              <li>
                <Link href="/products?category=bolts" className="hover:text-white transition-colors">
                  Bolts &amp; Socket Screws
                </Link>
              </li>
              <li>
                <Link href="/products?category=self-drilling-screws" className="hover:text-white transition-colors">
                  Self-Drilling Screws
                </Link>
              </li>
              <li>
                <Link href="/products?category=manufacturing-bolts" className="hover:text-white transition-colors">
                  Foundation Anchors
                </Link>
              </li>
              <li>
                <Link href="/products?category=anchor-fasteners" className="hover:text-white transition-colors">
                  Chemical &amp; Wedge Anchors
                </Link>
              </li>
              <li>
                <Link href="/products?category=abrasives" className="hover:text-white transition-colors">
                  Industrial Abrasives
                </Link>
              </li>
              <li>
                <Link href="/products?category=specialty-fasteners" className="hover:text-white transition-colors">
                  Specialty Alloys
                </Link>
              </li>
              <li>
                <Link href="/products?category=coatings-finishes" className="hover:text-white transition-colors">
                  Protective Coatings
                </Link>
              </li>
            </ul>
          </div>

          {/* Plant & Quality Coordinates */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider pb-2 border-b border-white/[0.08]">
              Plant Coordinates
            </h3>
            <div className="space-y-3 text-[13px] text-stone-400 font-normal">
              <div>
                <span className="text-white font-medium block">Chennai Headquarters:</span>
                <span className="text-stone-400 text-[12.5px] leading-relaxed block mt-0.5">
                  Industrial Estate, Guindy &amp; Ambattur Central Distribution Hub, Tamil Nadu
                </span>
              </div>
              <div>
                <span className="text-white font-medium block">Tirunelveli Works:</span>
                <span className="text-stone-400 text-[12.5px] leading-relaxed block mt-0.5">
                  Bespoke Hot Forging &amp; Foundation Bolt Fabrication Facility, South India
                </span>
              </div>
              <div className="pt-2">
                <span className="text-white font-medium block">Testing Lab:</span>
                <span className="text-stone-400 text-[12.5px] block mt-0.5">
                  1000 kN Tensile, Micro-Vickers &amp; Salt Spray Lab
                </span>
              </div>
            </div>
          </div>

          {/* B2B Procurement Desk */}
          <div className="space-y-3">
            <h3 className="text-[13px] font-semibold text-white uppercase tracking-wider pb-2 border-b border-white/[0.08]">
              Procurement
            </h3>
            <ul className="space-y-2.5 text-[13.5px] text-stone-400 font-normal">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Search 28 Products
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Admin Pricing Desk
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Commercial Purchase Orders
                </Link>
              </li>
              <li>
                <a href="#request-a-quote" className="text-[#D6B46A] hover:underline">
                  Submit Multi-Product RFQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-[12px] text-stone-500 gap-4">
          <div>
            &copy; 2026 FOIF (Fortress of Industrial Fasteners). All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>DIN / ISO / ASTM / IS Compliant</span>
            <span>•</span>
            <span>EN 10204 3.1 Quality Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
