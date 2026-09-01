import React from "react";
import Link from "next/link";
import { HeartHandshake, MapPin, Phone, Mail, Heart, MessageCircle } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/40 font-bengali">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <span className="text-lg font-bold text-foreground">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {APP_CONFIG.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              প্রয়োজনীয় লিংক
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  হোম পেজ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/blood-search" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  রক্তের সন্ধান
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  অনুদান প্রদান
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  সদস্য নিবন্ধন
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              যোগাযোগ
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{APP_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{APP_CONFIG.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{APP_CONFIG.email}</span>
              </li>
            </ul>
          </div>

          {/* Community & Social */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
              কমিউনিটি যুক্ত হোন
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              আমাদের অফিসিয়াল হোয়াটসঅ্যাপ বা মেসেঞ্জার গ্রুপে যুক্ত হয়ে সবশেষ আপডেট পান।
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={APP_CONFIG.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600/10 px-3.5 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-600/20 dark:text-emerald-300 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp গ্রুপে যুক্ত হন</span>
              </a>
              <a
                href={APP_CONFIG.messengerGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600/10 px-3.5 py-2 text-xs font-medium text-blue-700 hover:bg-blue-600/20 dark:text-blue-300 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Messenger গ্রুপে যুক্ত হন</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>
            © {currentYear} {APP_CONFIG.name}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="flex items-center gap-1">
            মানবতার সেবায় নিয়োজিত <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
