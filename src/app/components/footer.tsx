import { Film, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Film className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent">
                  دیدار
                </span>
                <span className="text-xs text-muted-foreground -mt-0.5">
                  تجربه‌ای تازه از سینما
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              دیدار، مرجع کامل فارسی زبانان برای کشف، بررسی و لذت بردن از دنیای سینما و سریال‌های جهان
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-3 bg-muted hover:bg-primary hover:text-white rounded-xl transition-all hover:scale-110 active:scale-95"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-muted hover:bg-primary hover:text-white rounded-xl transition-all hover:scale-110 active:scale-95"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-muted hover:bg-primary hover:text-white rounded-xl transition-all hover:scale-110 active:scale-95"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">دسترسی سریع</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/movies" className="text-muted-foreground hover:text-primary transition-colors">
                  فیلم‌ها
                </Link>
              </li>
              <li>
                <Link to="/series" className="text-muted-foreground hover:text-primary transition-colors">
                  سریال‌ها
                </Link>
              </li>
              <li>
                <Link to="/actors" className="text-muted-foreground hover:text-primary transition-colors">
                  بازیگران
                </Link>
              </li>
              <li>
                <Link to="/awards" className="text-muted-foreground hover:text-primary transition-colors">
                  جوایز و جشنواره‌ها
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-primary transition-colors">
                  اخبار و مقالات
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">درباره دیدار</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  قوانین و مقررات
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">تماس با ما</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">ایمیل</div>
                  <a href="mailto:info@didar.ir" className="hover:text-primary transition-colors">
                    info@didar.ir
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">تلفن</div>
                  <a href="tel:+982112345678" className="hover:text-primary transition-colors" dir="ltr">
                    021-1234-5678
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">آدرس</div>
                  <p className="text-sm leading-relaxed">
                    تهران
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-right">
              © ۱۴۰۳ دیدار. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-primary transition-colors">
                قوانین استفاده
              </Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                حریم خصوصی
              </Link>
              <a href="#" className="hover:text-primary transition-colors">
                کوکی‌ها
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
