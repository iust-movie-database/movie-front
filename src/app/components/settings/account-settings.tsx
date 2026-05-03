import { useState } from 'react';
import { User, Mail, Phone, AtSign, Save, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';

export function AccountSettings() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [bio, setBio] = useState('علاقه‌مند به سینمای کلاسیک و فیلم‌های هنری');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">حساب کاربری</h2>
        <p className="text-muted-foreground">مدیریت اطلاعات شخصی و تنظیمات حساب</p>
      </div>

      <div className="space-y-8">
        {/* Avatar */}
        <div>
          <label className="block mb-4 text-sm font-medium">تصویر پروفایل</label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative">
              <span className="text-3xl font-bold text-white">{firstName?.[0]}</span>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center shadow-lg transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl transition-all text-sm font-medium">
                تغییر تصویر
              </button>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG حداکثر 2MB</p>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">نام</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">نام خانوادگی</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block mb-2 text-sm font-medium">نام کاربری</label>
          <div className="relative">
            <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            نام کاربری شما در نمایش عمومی استفاده می‌شود
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium">ایمیل</label>
          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 text-sm font-medium">شماره موبایل</label>
          <div className="relative">
            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-2 text-sm font-medium">بیوگرافی</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full p-4 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            placeholder="درباره خودتان بنویسید..."
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {bio.length} / 500 کاراکتر
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
          <button className="text-sm text-red-500 hover:underline">
            حذف حساب کاربری
          </button>
        </div>
      </div>
    </div>
  );
}
