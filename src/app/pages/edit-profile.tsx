import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Camera, User, Mail, Phone, MapPin, Calendar, Globe, Palette, Lock, Eye, Shield, Smartphone, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { demoImages } from '../utils/image-placeholders';

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    // Basic Information
    firstName: 'علی',
    lastName: 'احمدی',
    username: 'ali_ahmadi',
    bio: 'علاقه‌مند به سینمای کلاسیک و فیلم‌های هنری. طرفدار نولان، کوبریک و تارانتینو',
    location: 'تهران، ایران',
    birthDate: '1370/05/15',

    // Contact
    email: 'ali.ahmadi@example.com',
    phone: '+98 912 345 6789',

    // Interests
    favoriteGenres: ['علمی-تخیلی', 'درام', 'جنایی'],
    favoriteActors: ['لئوناردو دی‌کاپریو', 'رابرت دنیرو'],
    favoriteDirectors: ['کریستوفر نولان', 'استنلی کوبریک'],

    // Preferences
    language: 'fa',
    theme: 'dark',

    // Privacy
    profileVisibility: 'public',
    showActivity: true,
  });

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update user context (would normally update via API)
      setSuccessMessage('تغییرات با موفقیت ذخیره شد');

      // Auto-hide success message and redirect
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setErrorMessage('خطا در ذخیره تغییرات. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-20">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">ویرایش پروفایل</h1>
            <p className="text-muted-foreground">اطلاعات و تنظیمات حساب کاربری خود را ویرایش کنید</p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-500">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cover & Avatar */}
            <section className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                تصاویر پروفایل
              </h2>

              {/* Cover Photo */}
              <div className="mb-6">
                <label className="block mb-3 text-sm font-medium">تصویر کاور</label>
                <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <img src={demoImages.banners[0]} alt="Cover" className="w-full h-full object-cover opacity-20" />
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-white mx-auto mb-2" />
                      <span className="text-white text-sm">آپلود تصویر کاور</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Avatar */}
              <div>
                <label className="block mb-3 text-sm font-medium">تصویر پروفایل</label>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary p-1">
                      <div className="w-full h-full rounded-xl bg-card flex items-center justify-center overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">ع</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-primary hover:bg-secondary rounded-xl shadow-lg transition-all cursor-pointer">
                      <Camera className="w-4 h-4 text-white" />
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>تصویر مربعی با حداقل ابعاد ۲۰۰×۲۰۰ پیکسل</p>
                    <p>فرمت‌های مجاز: JPG، PNG</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Basic Information */}
            <section className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                اطلاعات پایه
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">نام</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">نام خانوادگی</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium">نام کاربری</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium">بیوگرافی</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">موقعیت مکانی</label>
                  <div className="relative">
                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">تاریخ تولد</label>
                  <div className="relative">
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      placeholder="1370/01/01"
                      className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                اطلاعات تماس
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">ایمیل</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">شماره تلفن</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Interests */}
            <section className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                علایق سینمایی
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-sm font-medium">ژانرهای محبوب</label>
                  <div className="flex flex-wrap gap-2">
                    {['علمی-تخیلی', 'درام', 'جنایی', 'اکشن', 'کمدی', 'ترسناک', 'عاشقانه'].map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          const current = formData.favoriteGenres;
                          setFormData({
                            ...formData,
                            favoriteGenres: current.includes(genre)
                              ? current.filter(g => g !== genre)
                              : [...current, genre]
                          });
                        }}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          formData.favoriteGenres.includes(genre)
                            ? 'bg-primary text-white'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">بازیگران محبوب (با کاما جدا کنید)</label>
                  <input
                    type="text"
                    value={formData.favoriteActors.join(', ')}
                    onChange={(e) => setFormData({ ...formData, favoriteActors: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="لئوناردو دی‌کاپریو، رابرت دنیرو"
                    className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">کارگردان‌های محبوب (با کاما جدا کنید)</label>
                  <input
                    type="text"
                    value={formData.favoriteDirectors.join(', ')}
                    onChange={(e) => setFormData({ ...formData, favoriteDirectors: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="کریستوفر نولان، استنلی کوبریک"
                    className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Account Preferences */}
            <section className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                تنظیمات حساب
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">زبان</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                  >
                    <option value="fa">فارسی</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">تم رنگی</label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                  >
                    <option value="dark">تیره</option>
                    <option value="light">روشن</option>
                    <option value="auto">خودکار</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Privacy Settings */}
            <section className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                تنظیمات حریم خصوصی
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-sm font-medium">نمایش پروفایل</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, profileVisibility: 'public' })}
                      className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                        formData.profileVisibility === 'public'
                          ? 'bg-primary text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      عمومی
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, profileVisibility: 'private' })}
                      className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                        formData.profileVisibility === 'private'
                          ? 'bg-primary text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      خصوصی
                    </button>
                  </div>
                </div>

                <label className="flex items-center justify-between p-4 bg-muted/50 rounded-xl cursor-pointer group">
                  <div>
                    <div className="font-medium mb-1">نمایش فعالیت‌ها</div>
                    <div className="text-sm text-muted-foreground">فعالیت‌های شما برای سایرین قابل مشاهده باشد</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showActivity}
                    onChange={(e) => setFormData({ ...formData, showActivity: e.target.checked })}
                    className="w-5 h-5 rounded accent-primary cursor-pointer"
                  />
                </label>
              </div>
            </section>

            {/* Security */}
            <section className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                امنیت حساب
              </h2>

              <div className="space-y-4">
                <button
                  type="button"
                  className="w-full p-4 bg-muted hover:bg-muted/80 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary" />
                    <div className="text-right">
                      <div className="font-medium">تغییر رمز عبور</div>
                      <div className="text-sm text-muted-foreground">آخرین تغییر: ۳ ماه پیش</div>
                    </div>
                  </div>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">&larr;</span>
                </button>

                <button
                  type="button"
                  className="w-full p-4 bg-muted hover:bg-muted/80 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div className="text-right">
                      <div className="font-medium">احراز هویت دو مرحله‌ای (2FA)</div>
                      <div className="text-sm text-muted-foreground">غیرفعال</div>
                    </div>
                  </div>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">&larr;</span>
                </button>

                <button
                  type="button"
                  className="w-full p-4 bg-muted hover:bg-muted/80 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div className="text-right">
                      <div className="font-medium">نشست‌های فعال</div>
                      <div className="text-sm text-muted-foreground">۲ دستگاه متصل</div>
                    </div>
                  </div>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">&larr;</span>
                </button>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 bg-gradient-to-l from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-8 py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-all"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
