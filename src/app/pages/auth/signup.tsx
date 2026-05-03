import { Link, useNavigate } from 'react-router';
import { Film, Mail, Lock, Eye, EyeOff, User, Phone, AtSign, Upload, Check, X, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/auth-context';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const requirements = [
    { label: 'حداقل ۸ کاراکتر', met: password.length >= 8 },
    { label: 'حروف بزرگ و کوچک', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'حداقل یک عدد', met: /\d/.test(password) },
    { label: 'کاراکتر خاص', met: /[^a-zA-Z\d]/.test(password) },
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!username.trim()) {
      newErrors.username = 'نام کاربری الزامی است';
    } else if (username.length < 3) {
      newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
    }
    if (!email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }
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
    if (!acceptTerms) {
      newErrors.terms = 'باید قوانین را بپذیرید';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await signup(`${firstName} ${lastName}`, email, password);
      navigate('/signup-complete');
    } catch (error) {
      setErrors({ submit: 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Right Side - Cinematic Visual */}
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
            به خانواده<br />دیدار بپیوندید
          </h2>
          <p className="text-white/90 text-xl leading-relaxed drop-shadow-md">
            هزاران فیلم و سریال در انتظار شما
          </p>
        </div>
      </div>

      {/* Left Side - Premium Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
            <h1 className="text-4xl font-bold mb-2">ثبت‌نام</h1>
            <p className="text-muted-foreground">حساب کاربری خود را ایجاد کنید</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Error Alert */}
            {errors.submit && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{errors.submit}</p>
              </div>
            )}

            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-all">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">نام</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors({ ...errors, firstName: '' });
                    }}
                    placeholder="علی"
                    className={`w-full pr-10 pl-3 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all text-sm ${
                      errors.firstName ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">نام خانوادگی</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors({ ...errors, lastName: '' });
                    }}
                    placeholder="احمدی"
                    className={`w-full pr-10 pl-3 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all text-sm ${
                      errors.lastName ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                </div>
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
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
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: '' });
                  }}
                  placeholder="ali_ahmadi"
                  className={`w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.username ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary'
                  }`}
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium">ایمیل</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="example@email.com"
                  className={`w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 transition-all ${
                    errors.email ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                شماره موبایل <span className="text-xs text-muted-foreground">(اختیاری)</span>
              </label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full pr-12 pl-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
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
                    if (errors.password) setErrors({ ...errors, password: '' });
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
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}

              {/* Password Strength */}
              {password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">قدرت رمز عبور:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength === 25 ? 'text-red-500' :
                      passwordStrength.strength === 50 ? 'text-yellow-500' :
                      passwordStrength.strength === 75 ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        {req.met ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
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
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
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
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terms) setErrors({ ...errors, terms: '' });
                }}
                className="w-4 h-4 rounded mt-1 accent-primary cursor-pointer"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                <Link to="/terms" className="text-primary hover:underline">قوانین و مقررات</Link> و <Link to="/privacy" className="text-primary hover:underline">حریم خصوصی</Link> را می‌پذیرم
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-l from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <span className="text-muted-foreground">قبلاً ثبت‌نام کرده‌اید؟ </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              ورود
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
