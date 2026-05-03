import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('purple');

  const themes = [
    { value: 'light', label: 'روشن', icon: <Sun className="w-5 h-5" /> },
    { value: 'dark', label: 'تیره', icon: <Moon className="w-5 h-5" /> },
    { value: 'system', label: 'سیستم', icon: <Monitor className="w-5 h-5" /> },
  ];

  const accentColors = [
    { value: 'purple', label: 'بنفش', color: 'bg-purple-500' },
    { value: 'blue', label: 'آبی', color: 'bg-blue-500' },
    { value: 'green', label: 'سبز', color: 'bg-green-500' },
    { value: 'red', label: 'قرمز', color: 'bg-red-500' },
    { value: 'orange', label: 'نارنجی', color: 'bg-orange-500' },
    { value: 'pink', label: 'صورتی', color: 'bg-pink-500' },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">ظاهر</h2>
        <p className="text-muted-foreground">سفارشی‌سازی تم و رنگ‌بندی</p>
      </div>

      <div className="space-y-8">
        {/* Theme Selection */}
        <section>
          <h3 className="font-bold mb-4">حالت تم</h3>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`p-6 border-2 rounded-2xl transition-all hover:border-primary/50 ${
                  theme === themeOption.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === themeOption.value ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                    {themeOption.icon}
                  </div>
                  <span className="font-medium">{themeOption.label}</span>
                  {theme === themeOption.value && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Accent Color */}
        <section>
          <h3 className="font-bold mb-4">رنگ اصلی</h3>
          <div className="grid grid-cols-6 gap-4">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value)}
                className="flex flex-col items-center gap-2 p-4 hover:bg-muted rounded-xl transition-all"
              >
                <div className={`w-12 h-12 rounded-full ${color.color} relative`}>
                  {accentColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs">{color.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 p-4 bg-muted/50 rounded-xl text-sm text-muted-foreground">
            تغییر رنگ اصلی در نسخه‌های بعدی پیاده‌سازی خواهد شد
          </p>
        </section>

        {/* Font Size */}
        <section>
          <h3 className="font-bold mb-4">اندازه فونت</h3>
          <div className="p-6 bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">کوچک</span>
              <span className="text-sm">متوسط</span>
              <span className="text-sm">بزرگ</span>
            </div>
            <input
              type="range"
              min="12"
              max="18"
              defaultValue="16"
              className="w-full accent-primary"
            />
            <p className="mt-4 text-sm text-muted-foreground text-center">
              پیش‌نمایش متن با اندازه انتخابی
            </p>
          </div>
        </section>

        {/* Language */}
        <section>
          <h3 className="font-bold mb-4">زبان</h3>
          <div className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-medium mb-1">فارسی</div>
              <div className="text-sm text-muted-foreground">زبان پیش‌فرض برنامه</div>
            </div>
            <div className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg">
              فعال
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
