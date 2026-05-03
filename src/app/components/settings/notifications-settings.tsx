import { useState } from 'react';
import { Bell, Mail, Smartphone, Award, MessageCircle, Users, Star } from 'lucide-react';

export function NotificationsSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [awardsAlerts, setAwardsAlerts] = useState(true);
  const [repliesAlerts, setRepliesAlerts] = useState(true);
  const [followersAlerts, setFollowersAlerts] = useState(true);
  const [ratingsAlerts, setRatingsAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all ${
        value ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
        value ? 'left-0.5' : 'right-0.5'
      }`} />
    </button>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">اعلان‌ها</h2>
        <p className="text-muted-foreground">مدیریت اعلان‌های ایمیل و پوش</p>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <section>
          <h3 className="font-bold mb-4">اعلان‌های ایمیل</h3>
          <div className="space-y-3">
            <div className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">اعلان‌های ایمیل</div>
                    <div className="text-sm text-muted-foreground">دریافت اعلان‌ها از طریق ایمیل</div>
                  </div>
                </div>
                <Toggle value={emailNotifications} onChange={setEmailNotifications} />
              </div>
            </div>

            <div className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">خلاصه هفتگی</div>
                    <div className="text-sm text-muted-foreground">دریافت خلاصه فعالیت‌های هفته</div>
                  </div>
                </div>
                <Toggle value={weeklyDigest} onChange={setWeeklyDigest} />
              </div>
            </div>
          </div>
        </section>

        {/* Push Notifications */}
        <section>
          <h3 className="font-bold mb-4">اعلان‌های پوش</h3>
          <div className="space-y-3">
            <div className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">اعلان‌های موبایل</div>
                    <div className="text-sm text-muted-foreground">دریافت اعلان در موبایل</div>
                  </div>
                </div>
                <Toggle value={pushNotifications} onChange={setPushNotifications} />
              </div>
            </div>
          </div>
        </section>

        {/* Activity Alerts */}
        <section>
          <h3 className="font-bold mb-4">اعلان‌های فعالیت</h3>
          <div className="space-y-3">
            <div className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">جوایز و دستاوردها</div>
                    <div className="text-sm text-muted-foreground">دریافت شارژ جدید، اعلام برنده و...</div>
                  </div>
                </div>
                <Toggle value={awardsAlerts} onChange={setAwardsAlerts} />
              </div>
            </div>

            <div className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">پاسخ‌ها و نظرات</div>
                    <div className="text-sm text-muted-foreground">پاسخ به نقد یا نظر شما</div>
                  </div>
                </div>
                <Toggle value={repliesAlerts} onChange={setRepliesAlerts} />
              </div>
            </div>

            <div className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">دنبال‌کنندگان جدید</div>
                    <div className="text-sm text-muted-foreground">کاربر جدیدی شما را دنبال کرد</div>
                  </div>
                </div>
                <Toggle value={followersAlerts} onChange={setFollowersAlerts} />
              </div>
            </div>

            <div className="p-5 bg-card border border-border rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">لایک امتیازها</div>
                    <div className="text-sm text-muted-foreground">کسی امتیاز شما را لایک کرد</div>
                  </div>
                </div>
                <Toggle value={ratingsAlerts} onChange={setRatingsAlerts} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
