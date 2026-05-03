import { Link, useNavigate } from 'react-router';
import { Film, Mail, Lock, Eye, EyeOff, User, Check, X, Upload } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { motion } from 'motion/react';

export function SignupCompletePage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Password strength calculation
  const getPasswordStrength = (pass: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;

    if (strength === 0) return { strength: 0, label: '', color: '' };
    if (strength === 1) return { strength: 25, label: 'ضعیف', color: 'bg-red-500' };
    if (strength === 2) return { strength: 50, label: 'متوسط', color: 'bg-yellow-500' };
    if (strength === 3) return { strength: 75, label: 'خوب', color: 'bg-blue-500' };
    return { strength: 100, label: 'عالی', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!formData.username.trim()) newErrors.username = 'نام کاربری الزامی است';
    else if (formData.username.length < 3) newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';

    if (!formData.email.trim()) newErrors.email = 'ایمیل الزامی است';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'ایمیل معتبر نیست';

    if (!formData.password) newErrors.password = 'رمز عبور الزامی است';
    else if (formData.password.length < 8) newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیست';
    }

    if (!agreedToTerms) newErrors.terms = 'پذیرش قوانین الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await signup(fullName, formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setErrors({ submit: 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Film className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">دیدار</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">ثبت‌نام</h1>
            <p className="text-muted-foreground">حساب کاربری خود را ایجاد کنید</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">نام</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.firstName ? 'ring-2 ring-red-500' : 'focus:ring-primary'
                  }`}
                  placeholder="علی"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <X className="w-3 h-3" /> {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">نام خانوادگی</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.lastName ? 'ring-2 ring-red-500' : 'focus:ring-primary'
                  }`}
                  placeholder="احمدی"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <X className="w-3 h-3" /> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block mb-2 text-sm font-medium">نام کاربری</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.username ? 'ring-2 ring-red-500' : 'focus:ring-primary'
                  }`}
                  placeholder="ali_ahmadi"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" /> {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium">ایمیل</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.email ? 'ring-2 ring-red-500' : 'focus:ring-primary'
                  }`}
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pr-12 pl-12 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.password ? 'ring-2 ring-red-500' : 'focus:ring-primary'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" /> {errors.password}
                </p>
              )}

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">قدرت رمز عبور:</span>
                    <span className={`font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-medium">تأیید رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full pr-12 pl-12 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword ? 'ring-2 ring-red-500' : 'focus:ring-primary'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" /> {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> رمز عبور مطابقت دارد
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded mt-0.5 accent-primary"
              />
              <span className={`text-sm ${errors.terms ? 'text-red-500' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`}>
                <Link to="/terms" className="text-primary hover:underline">قوانین و مقررات</Link> و <Link to="/privacy" className="text-primary hover:underline">حریم خصوصی</Link> را می‌پذیرم
              </span>
            </label>

            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-l from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">قبلاً ثبت‌نام کرده‌اید؟ </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              ورود
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/banners/cinema-wide.jpg')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
              <Film className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">دیدار</span>
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            به خانواده<br />دیدار بپیوندید
          </h2>
          <p className="text-white/90 text-xl leading-relaxed">
            هزاران فیلم و سریال در انتظار شما
          </p>
        </div>
      </div>
    </div>
  );
}
