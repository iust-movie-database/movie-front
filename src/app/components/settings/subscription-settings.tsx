import { Crown, Check, CreditCard, Download, Calendar } from 'lucide-react';

export function SubscriptionSettings() {
  const currentPlan = 'free';

  const invoices = [
    { id: '1234', date: '۱۴۰۲/۱۲/۰۱', amount: '۰ تومان', status: 'پرداخت شده', plan: 'رایگان' },
    { id: '1233', date: '۱۴۰۲/۱۱/۰۱', amount: '۰ تومان', status: 'پرداخت شده', plan: 'رایگان' },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">اشتراک</h2>
        <p className="text-muted-foreground">مدیریت اشتراک و پرداخت‌ها</p>
      </div>

      <div className="space-y-8">
        {/* Current Plan */}
        <section>
          <h3 className="font-bold mb-4">پلن فعلی</h3>
          <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-2xl font-bold">رایگان</h4>
                  {currentPlan === 'free' && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                      فعال
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">دسترسی به امکانات پایه</p>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              {[
                'مشاهده فیلم‌ها و سریال‌ها',
                'امتیاز و نقد محدود',
                'ساخت لیست‌های شخصی',
                'دنبال کردن کاربران',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VIP Plan */}
        <section>
          <h3 className="font-bold mb-4">ارتقا به VIP</h3>
          <div className="p-6 bg-gradient-to-br from-primary to-secondary rounded-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8" />
                <h4 className="text-2xl font-bold">اشتراک VIP</h4>
              </div>
              <p className="text-white/90 mb-6">دسترسی به تمام امکانات ویژه دیدار</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  'نقد و امتیاز نامحدود',
                  'دسترسی زودتر به جوایز',
                  'نشان اختصاصی VIP',
                  'پشتیبانی اختصاصی',
                  'بدون تبلیغات',
                  'آمار پیشرفته',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-bold">۴۹,۰۰۰</span>
                <span className="text-white/70 mb-1">تومان / ماه</span>
              </div>
              <button className="w-full py-3 bg-white hover:bg-white/90 text-primary rounded-xl font-bold transition-all">
                ارتقا به VIP
              </button>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section>
          <h3 className="font-bold mb-4">روش پرداخت</h3>
          <div className="p-6 bg-card border border-border rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">کارت بانکی</div>
                <div className="text-sm text-muted-foreground">هنوز کارتی اضافه نشده است</div>
              </div>
              <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl transition-all text-sm font-medium">
                افزودن کارت
              </button>
            </div>
          </div>
        </section>

        {/* Invoices */}
        <section>
          <h3 className="font-bold mb-4">تاریخچه پرداخت</h3>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-5 bg-card border border-border rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">فاکتور #{invoice.id}</div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{invoice.date}</span>
                        <span>•</span>
                        <span>{invoice.plan}</span>
                        <span>•</span>
                        <span className="text-green-500">{invoice.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold">{invoice.amount}</div>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-xl transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
