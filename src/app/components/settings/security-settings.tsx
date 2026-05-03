import { useState } from 'react';
import { Lock, Shield, Smartphone, Monitor, MapPin, Calendar, Check, X } from 'lucide-react';

export function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const activeSessions = [
    { id: 1, device: 'Chrome - Windows', location: 'تهران، ایران', lastActive: '۵ دقیقه پیش', current: true },
    { id: 2, device: 'Safari - iPhone', location: 'تهران، ایران', lastActive: '۲ ساعت پیش', current: false },
    { id: 3, device: 'Firefox - macOS', location: 'شیراز، ایران', lastActive: '۱ روز پیش', current: false },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">امنیت</h2>
        <p className="text-muted-foreground">مدیریت امنیت حساب و دسترسی‌ها</p>
      </div>

      <div className="space-y-8">
        {/* Change Password */}
        <section className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">تغییر رمز عبور</h3>
              <p className="text-sm text-muted-foreground">رمز عبور قوی برای حفاظت از حساب</p>
            </div>
            <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl transition-all text-sm font-medium">
              تغییر رمز
            </button>
          </div>
          <div className="text-xs text-muted-foreground">
            آخرین تغییر: ۲ هفته پیش
          </div>
        </section>

        {/* Two-Factor Authentication */}
        <section className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">احراز هویت دو مرحله‌ای</h3>
              <p className="text-sm text-muted-foreground">افزودن لایه امنیتی اضافی به حساب شما</p>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative w-12 h-6 rounded-full transition-all ${
                twoFactorEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                twoFactorEnabled ? 'left-0.5' : 'right-0.5'
              }`} />
            </button>
          </div>
          {twoFactorEnabled && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-500">احراز هویت دو مرحله‌ای فعال است</span>
            </div>
          )}
        </section>

        {/* Active Sessions */}
        <section>
          <h3 className="font-bold mb-4">نشست‌های فعال</h3>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="p-5 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {session.device.includes('iPhone') ? (
                      <Smartphone className="w-5 h-5 text-primary" />
                    ) : (
                      <Monitor className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{session.device}</h4>
                      {session.current && (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded-full">
                          فعلی
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{session.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-red-500 hover:underline">
            پایان تمام نشست‌ها (به جز نشست فعلی)
          </button>
        </section>

        {/* Login History */}
        <section>
          <h3 className="font-bold mb-4">تاریخچه ورود</h3>
          <div className="space-y-2">
            {[
              { date: '۲۰۲۶/۰۵/۰۳ ۱۴:۳۰', location: 'تهران، ایران', success: true },
              { date: '۲۰۲۶/۰۵/۰۲ ۰۹:۱۵', location: 'تهران، ایران', success: true },
              { date: '۲۰۲۶/۰۵/۰۱ ۲۰:۴۵', location: 'تهران، ایران', success: true },
              { date: '۲۰۲۶/۰۴/۳۰ ۱۸:۲۰', location: 'مکان نامشخص', success: false },
            ].map((login, i) => (
              <div key={i} className="p-4 bg-card border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${login.success ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <div className="text-sm font-medium">{login.date}</div>
                    <div className="text-xs text-muted-foreground">{login.location}</div>
                  </div>
                </div>
                <span className={`text-xs ${login.success ? 'text-green-500' : 'text-red-500'}`}>
                  {login.success ? 'موفق' : 'ناموفق'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
