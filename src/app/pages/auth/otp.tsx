import { Link, useNavigate, useLocation } from 'react-router';
import { Film, ArrowRight, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'example@email.com';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);
    setError('');

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields filled
    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value].join('');
      if (fullOtp.length === 6) {
        handleSubmit(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: clear current and move to previous
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Arrow keys navigation
    if (e.key === 'ArrowLeft' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');
      inputRefs.current[5]?.focus();

      // Auto-submit on paste
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (code?: string) => {
    const otpCode = code || otp.join('');

    if (otpCode.length !== 6) {
      setError('لطفاً کد ۶ رقمی را وارد کنید');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo: accept 123456 as valid code
      if (otpCode === '123456') {
        navigate('/reset-password', { state: { email, otpCode } });
      } else {
        setError('کد وارد شده نادرست است');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('خطا در تأیید کد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message briefly
    } catch (error) {
      setError('خطا در ارسال مجدد کد');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/banners/night-wide.jpg')] opacity-10 bg-cover bg-center" />
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
            تأیید هویت<br />امن و سریع
          </h2>
          <p className="text-white/90 text-xl leading-relaxed drop-shadow-md">
            کد ۶ رقمی ارسال شده را وارد کنید
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
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <span>بازگشت</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">کد تأیید</h1>
            <p className="text-muted-foreground">
              کد ۶ رقمی به ایمیل <span className="font-medium text-foreground">{email}</span> ارسال شد
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-8">
            <div className="flex gap-3 justify-center" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-16 text-center text-2xl font-bold bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Resend Code */}
          <div className="text-center mb-6">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline font-medium"
              >
                ارسال مجدد کد
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">
                ارسال مجدد کد در <span className="font-medium text-foreground">{resendTimer}</span> ثانیه
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full py-3 bg-gradient-to-l from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? 'در حال تأیید...' : 'تأیید کد'}
          </button>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>کد را دریافت نکردید؟ پوشه هرزنامه (Spam) را بررسی کنید</p>
          </div>
        </div>
      </div>
    </div>
  );
}
