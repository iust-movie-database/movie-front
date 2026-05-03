// Admin stub pages
export function AdminDashboard() {
  return <div><h1 className="text-4xl font-bold mb-8">داشبورد مدیریت</h1><div className="grid grid-cols-4 gap-6"><div className="p-6 bg-card rounded-2xl border border-border"><div className="text-3xl font-bold mb-2">12,450</div><div className="text-muted-foreground">کاربران</div></div><div className="p-6 bg-card rounded-2xl border border-border"><div className="text-3xl font-bold mb-2">8,230</div><div className="text-muted-foreground">فیلم‌ها</div></div><div className="p-6 bg-card rounded-2xl border border-border"><div className="text-3xl font-bold mb-2">4,120</div><div className="text-muted-foreground">سریال‌ها</div></div><div className="p-6 bg-card rounded-2xl border border-border"><div className="text-3xl font-bold mb-2">25,680</div><div className="text-muted-foreground">نقدها</div></div></div></div>;
}

export function AdminUsers() {
  return <div><h1 className="text-4xl font-bold mb-8">مدیریت کاربران</h1><p className="text-muted-foreground">لیست و مدیریت کاربران</p></div>;
}

export function AdminMovies() {
  return <div><h1 className="text-4xl font-bold mb-8">مدیریت فیلم‌ها</h1><p className="text-muted-foreground">افزودن و ویرایش فیلم‌ها</p></div>;
}

export function AdminSeries() {
  return <div><h1 className="text-4xl font-bold mb-8">مدیریت سریال‌ها</h1><p className="text-muted-foreground">افزودن و ویرایش سریال‌ها</p></div>;
}

export function AdminPeople() {
  return <div><h1 className="text-4xl font-bold mb-8">مدیریت افراد</h1><p className="text-muted-foreground">بازیگران، کارگردان‌ها و عوامل</p></div>;
}

export function AdminReviews() {
  return <div><h1 className="text-4xl font-bold mb-8">مدیریت نقدها</h1><p className="text-muted-foreground">بررسی و تأیید نقدها</p></div>;
}

export function AdminReports() {
  return <div><h1 className="text-4xl font-bold mb-8">گزارش‌ها</h1><p className="text-muted-foreground">بررسی گزارش‌های کاربران</p></div>;
}

export function AdminAnalytics() {
  return <div><h1 className="text-4xl font-bold mb-8">آمار و تحلیل</h1><p className="text-muted-foreground">آمار استفاده از پلتفرم</p></div>;
}

export function AdminSettings() {
  return <div><h1 className="text-4xl font-bold mb-8">تنظیمات</h1><p className="text-muted-foreground">تنظیمات عمومی پلتفرم</p></div>;
}
