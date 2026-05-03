import { Link, useNavigate, useLocation } from 'react-router';
import { Film, Lock, Eye, EyeOff, AlertCircle, Check, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

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

  const passwordStrength = getPasswordStrength(password);

  // Password requirements checklist
  const requirements = [
    { label: 'حداقل ۸ کاراکتر', met: password.length >= 8 },
    { label: 'حروف بزرگ و کوچک', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'حداقل یک عدد', met: /\d/.test(password) },
    { label: 'حداقل یک کاراکتر خاص', met: /[^a-zA-Z\d]/.test(password) },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'تکرار رمز عبور الزامی است';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیست';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success screen
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setErrors({ submit: 'خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="w-full max-w-md text-center">
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-500/20">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-4xl font-bold mb-4">رمز عبور تغییر کرد!</h1>
          <p className="text-muted-foreground mb-8">
            رمز عبور شما با موفقیت تغییر کرد. در حال انتقال به صفحه ورود...
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <Link
            to="/login"
            className="inline-block mt-8 text-primary hover:underline font-medium"
          >
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/banners/film-wide.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-xl">
              <Film className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white drop-shadow-lg">دیدار</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
            رمز عبور جدید<br />امن و قوی
          </h2>
          <p className="text-white/90 text-xl leading-relaxed drop-shadow-md">
            رمز عبور قوی برای امنیت حساب شما
          </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Film className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">دیدار</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">تعیین رمز عبور جدید</h1>
            <p className="text-muted-foreground">
              رمز عبور جدید خود را وارد کنید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {errors.submit && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{errors.submit}</p>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block mb-2 text-sm font-medium">رمز عبور جدید</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: '' });
                    }
                  }}
                  placeholder="••••••••"
                  className={`w-full pr-12 pl-12 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.password ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">قدرت رمز عبور:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength === 25 ? 'text-red-500' :
                      passwordStrength.strength === 50 ? 'text-yellow-500' :
                      passwordStrength.strength === 75 ? 'text-blue-500' :
                      'text-green-500'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm font-medium">تکرار رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  placeholder="••••••••"
                  className={`w-full pr-12 pl-12 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {confirmPassword && password === confirmPassword && (
                  <div className="absolute left-12 top-1/2 -translate-y-1/2">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements Checklist */}
            {password && (
              <div className="p-4 bg-muted/50 rounded-xl space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-3">الزامات رمز عبور:</p>
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-l from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'در حال ذخیره...' : 'تغییر رمز عبور'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
