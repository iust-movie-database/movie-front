import { Link, useNavigate } from 'react-router';
import { Film, Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'ایمیل معتبر نیست';
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

      // Show success and redirect to OTP page
      setSuccess(true);
      setTimeout(() => {
        navigate('/otp', { state: { email } });
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'خطا در ارسال کد. لطفاً دوباره تلاش کنید.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/banners/theater-wide.jpg')] opacity-10 bg-cover bg-center" />
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
            بازیابی رمز عبور<br />ساده و سریع
          </h2>
          <p className="text-white/90 text-xl leading-relaxed drop-shadow-md">
            کد تأیید را به ایمیل شما ارسال می‌کنیم
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

          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <span>بازگشت به ورود</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">فراموشی رمز عبور</h1>
            <p className="text-muted-foreground">
              ایمیل خود را وارد کنید تا کد تأیید برای شما ارسال شود
            </p>
          </div>

          {success ? (
            /* Success State */
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-bold text-green-500">کد ارسال شد!</h3>
                  <p className="text-sm text-muted-foreground">در حال انتقال به صفحه تأیید...</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                کد تأیید ۶ رقمی به ایمیل <span className="font-medium text-foreground">{email}</span> ارسال شد.
              </p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {errors.submit && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-500">{errors.submit}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block mb-2 text-sm font-medium">ایمیل</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                    placeholder="example@email.com"
                    className={`w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                      errors.email ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-l from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'در حال ارسال...' : 'ارسال کد تأیید'}
              </button>
            </form>
          )}

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <span className="text-muted-foreground">رمز عبور خود را به یاد آوردید؟ </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              ورود
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
