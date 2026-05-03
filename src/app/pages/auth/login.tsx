import { Link, useNavigate } from 'react-router';
import { Film, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'نام کاربری یا ایمیل الزامی است';
    }

    if (!password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await login(usernameOrEmail, password);
      if (rememberMe) {
        localStorage.setItem('didar_remember', 'true');
      }
      navigate('/');
    } catch (error) {
      setErrors({ submit: 'نام کاربری یا رمز عبور اشتباه است' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/banners/cinema-wide.jpg')] opacity-10 bg-cover bg-center" />
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
            دنیای سینما<br />در یک نگاه
          </h2>
          <p className="text-white/90 text-xl leading-relaxed drop-shadow-md">
            کشف کنید، بررسی کنید، تجربه کنید
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Film className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">دیدار</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">خوش آمدید</h1>
            <p className="text-muted-foreground">برای ادامه وارد حساب کاربری خود شوید</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Alert */}
            {errors.submit && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{errors.submit}</p>
              </div>
            )}

            {/* Username or Email */}
            <div>
              <label className="block mb-2 text-sm font-medium">نام کاربری یا ایمیل</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => {
                    setUsernameOrEmail(e.target.value);
                    if (errors.usernameOrEmail) {
                      setErrors({ ...errors, usernameOrEmail: '' });
                    }
                  }}
                  placeholder="نام کاربری یا example@email.com"
                  className={`w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.usernameOrEmail ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary'
                  }`}
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.usernameOrEmail}
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-sm group-hover:text-primary transition-colors">مرا به خاطر بسپار</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline hover:text-secondary transition-colors"
              >
                فراموشی رمز عبور؟
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-l from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">حساب کاربری ندارید؟ </span>
            <Link to="/signup" className="text-primary font-medium hover:underline">
              ثبت‌نام کنید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
