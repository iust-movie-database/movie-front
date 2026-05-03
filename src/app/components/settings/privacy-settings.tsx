import { useState } from 'react';
import { Eye, EyeOff, Users, Activity, Heart, MessageCircle } from 'lucide-react';

export function PrivacySettings() {
  const [profilePublic, setProfilePublic] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [showReviews, setShowReviews] = useState(true);
  const [allowFollowers, setAllowFollowers] = useState(true);

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
        <h2 className="text-3xl font-bold mb-2">حریم خصوصی</h2>
        <p className="text-muted-foreground">کنترل اطلاعات قابل مشاهده برای سایرین</p>
      </div>

      <div className="space-y-4">
        {/* Public Profile */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {profilePublic ? <Eye className="w-5 h-5 text-primary" /> : <EyeOff className="w-5 h-5 text-primary" />}
              </div>
              <div>
                <h3 className="font-medium mb-1">پروفایل عمومی</h3>
                <p className="text-sm text-muted-foreground">
                  همه می‌توانند پروفایل شما را ببینند
                </p>
              </div>
            </div>
            <Toggle value={profilePublic} onChange={setProfilePublic} />
          </div>
        </div>

        {/* Show Activity */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">نمایش فعالیت‌ها</h3>
                <p className="text-sm text-muted-foreground">
                  امتیازها و نقدهای اخیر شما نمایش داده شود
                </p>
              </div>
            </div>
            <Toggle value={showActivity} onChange={setShowActivity} />
          </div>
        </div>

        {/* Show Favorites */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">نمایش علاقه‌مندی‌ها</h3>
                <p className="text-sm text-muted-foreground">
                  لیست علاقه‌مندی‌های شما برای دیگران نمایش داده شود
                </p>
              </div>
            </div>
            <Toggle value={showFavorites} onChange={setShowFavorites} />
          </div>
        </div>

        {/* Show Reviews */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">نمایش نقدها</h3>
                <p className="text-sm text-muted-foreground">
                  نقدهای شما برای عموم قابل مشاهده باشد
                </p>
              </div>
            </div>
            <Toggle value={showReviews} onChange={setShowReviews} />
          </div>
        </div>

        {/* Allow Followers */}
        <div className="p-6 bg-card border border-border rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">مجاز بودن دنبال‌کنندگان</h3>
                <p className="text-sm text-muted-foreground">
                  کاربران بتوانند شما را دنبال کنند
                </p>
              </div>
            </div>
            <Toggle value={allowFollowers} onChange={setAllowFollowers} />
          </div>
        </div>

        {/* Blocked Users */}
        <div className="mt-8">
          <h3 className="font-bold mb-4">کاربران مسدود شده</h3>
          <div className="p-8 bg-card border border-border rounded-2xl text-center">
            <p className="text-muted-foreground">هنوز کاربری را مسدود نکرده‌اید</p>
          </div>
        </div>
      </div>
    </div>
  );
}
