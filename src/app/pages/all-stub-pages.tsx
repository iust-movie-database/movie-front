// This file contains all stub pages for quick implementation
import { PageTemplate } from '../components/page-template';
import { Link } from 'react-router';

// Genres, Awards, Community, Reviews, News, About, Contact, FAQ, Terms, Privacy, VIP, User Profile, Search
// Series Detail, Episode Detail, Actor Detail, Genre Detail, Award Detail, Review Detail, News Detail, Collection Detail, Not Found

export function GenresPage() {
  return <PageTemplate title="ژانرها" subtitle="کاوش بر اساس ژانر"><div className="text-center py-20 text-muted-foreground">صفحه ژانرها - در حال توسعه</div></PageTemplate>;
}

export function AwardsPage() {
  return <PageTemplate title="جوایز و جشنواره‌ها" subtitle="برندگان و نامزدهای جوایز معتبر"><div className="text-center py-20 text-muted-foreground">صفحه جوایز - در حال توسعه</div></PageTemplate>;
}

export function CommunityPage() {
  return <PageTemplate title="جامعه" subtitle="به گفتگو بپیوندید"><div className="text-center py-20 text-muted-foreground">صفحه جامعه - در حال توسعه</div></PageTemplate>;
}

export function ReviewsPage() {
  return <PageTemplate title="نقدها" subtitle="نقدهای برتر کاربران"><div className="text-center py-20 text-muted-foreground">صفحه نقدها - در حال توسعه</div></PageTemplate>;
}

export function NewsPage() {
  return <PageTemplate title="اخبار" subtitle="جدیدترین اخبار دنیای سینما"><div className="text-center py-20 text-muted-foreground">صفحه اخبار - در حال توسعه</div></PageTemplate>;
}

export function AboutPage() {
  return <PageTemplate title="درباره دیدار" subtitle="داستان ما"><div className="p-8 bg-card rounded-3xl border border-border"><p className="text-lg leading-relaxed">دیدار، مرجع کامل فارسی‌زبانان برای کشف و بررسی فیلم‌ها و سریال‌های جهان است.</p></div></PageTemplate>;
}

export function ContactPage() {
  return <PageTemplate title="تماس با ما" subtitle="در ارتباط باشیم"><div className="p-8 bg-card rounded-3xl border border-border"><p>info@didar.ir</p></div></PageTemplate>;
}

export function FAQPage() {
  return <PageTemplate title="سوالات متداول" subtitle="پاسخ به سوالات شما"><div className="text-center py-20 text-muted-foreground">صفحه سوالات - در حال توسعه</div></PageTemplate>;
}

export function TermsPage() {
  return <PageTemplate title="قوانین و مقررات" subtitle="شرایط استفاده از دیدار"><div className="p-8 bg-card rounded-3xl border border-border"><p className="text-lg leading-relaxed">قوانین و مقررات استفاده از پلتفرم دیدار...</p></div></PageTemplate>;
}

export function PrivacyPage() {
  return <PageTemplate title="حریم خصوصی" subtitle="سیاست حفظ حریم خصوصی"><div className="p-8 bg-card rounded-3xl border border-border"><p className="text-lg leading-relaxed">ما به حریم خصوصی شما اهمیت می‌دهیم...</p></div></PageTemplate>;
}

export function VIPPage() {
  return <PageTemplate title="عضویت VIP" subtitle="امکانات ویژه برای شما"><div className="text-center py-20"><Link to="/signup" className="inline-block px-8 py-4 bg-gradient-to-l from-primary to-secondary text-white rounded-2xl font-bold">خرید اشتراک</Link></div></PageTemplate>;
}

export function UserProfilePage() {
  return <PageTemplate title="پروفایل کاربر" subtitle="اطلاعات عمومی"><div className="text-center py-20 text-muted-foreground">صفحه پروفایل عمومی کاربر</div></PageTemplate>;
}

export function SearchPage() {
  return <PageTemplate title="نتایج جستجو" subtitle="نتایج مرتبط"><div className="text-center py-20 text-muted-foreground">صفحه نتایج جستجو</div></PageTemplate>;
}

export function SeriesDetailPage() {
  return <PageTemplate title="جزئیات سریال" subtitle="اطلاعات کامل سریال"><div className="text-center py-20 text-muted-foreground">صفحه جزئیات سریال</div></PageTemplate>;
}

export function EpisodeDetailPage() {
  return <PageTemplate title="جزئیات قسمت" subtitle="اطلاعات قسمت"><div className="text-center py-20 text-muted-foreground">صفحه جزئیات قسمت</div></PageTemplate>;
}

export function ActorDetailPage() {
  return <PageTemplate title="پروفایل بازیگر" subtitle="بیوگرافی و آثار"><div className="text-center py-20 text-muted-foreground">صفحه پروفایل بازیگر</div></PageTemplate>;
}

export function GenreDetailPage() {
  return <PageTemplate title="ژانر" subtitle="فیلم‌های این ژانر"><div className="text-center py-20 text-muted-foreground">صفحه ژانر</div></PageTemplate>;
}

export function AwardDetailPage() {
  return <PageTemplate title="جایزه" subtitle="برندگان و تاریخچه"><div className="text-center py-20 text-muted-foreground">صفحه جایزه</div></PageTemplate>;
}

export function ReviewDetailPage() {
  return <PageTemplate title="نقد کامل" subtitle="خواندن نقد"><div className="text-center py-20 text-muted-foreground">صفحه نقد کامل</div></PageTemplate>;
}

export function NewsDetailPage() {
  return <PageTemplate title="خبر" subtitle="جزئیات خبر"><div className="text-center py-20 text-muted-foreground">صفحه خبر</div></PageTemplate>;
}

export function CollectionDetailPage() {
  return <PageTemplate title="مجموعه" subtitle="لیست فیلم‌ها"><div className="text-center py-20 text-muted-foreground">صفحه مجموعه</div></PageTemplate>;
}

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">صفحه یافت نشد</h2>
        <p className="text-muted-foreground mb-8">صفحه‌ای که دنبال آن هستید وجود ندارد</p>
        <Link to="/" className="px-8 py-4 bg-gradient-to-l from-primary to-secondary text-white rounded-2xl font-bold hover:scale-105 transition-transform inline-block">
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}

// Auth pages
export function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">تأیید ایمیل</h1>
        <p className="text-muted-foreground mb-8">لینک تأیید به ایمیل شما ارسال شد</p>
        <Link to="/otp" className="px-8 py-4 bg-primary text-white rounded-xl inline-block">ادامه</Link>
      </div>
    </div>
  );
}

export function OTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">کد تأیید</h1>
        <p className="text-muted-foreground mb-8">کد ارسال شده را وارد کنید</p>
        <Link to="/onboarding" className="px-8 py-4 bg-primary text-white rounded-xl inline-block">تأیید</Link>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">بازیابی رمز عبور</h1>
        <p className="text-muted-foreground mb-8">ایمیل خود را وارد کنید</p>
        <Link to="/reset-password" className="px-8 py-4 bg-primary text-white rounded-xl inline-block">ارسال</Link>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">رمز عبور جدید</h1>
        <p className="text-muted-foreground mb-8">رمز عبور جدید خود را وارد کنید</p>
        <Link to="/login" className="px-8 py-4 bg-primary text-white rounded-xl inline-block">ثبت</Link>
      </div>
    </div>
  );
}

export function TwoFactorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">احراز هویت دو مرحله‌ای</h1>
        <p className="text-muted-foreground mb-8">کد را از اپلیکیشن خود وارد کنید</p>
        <Link to="/dashboard" className="px-8 py-4 bg-primary text-white rounded-xl inline-block">تأیید</Link>
      </div>
    </div>
  );
}

export function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">به دیدار خوش آمدید!</h1>
        <p className="text-muted-foreground mb-8">چند سوال ساده برای شروع</p>
        <Link to="/dashboard" className="px-8 py-4 bg-primary text-white rounded-xl inline-block">شروع</Link>
      </div>
    </div>
  );
}
