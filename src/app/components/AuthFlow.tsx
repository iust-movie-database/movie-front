import { useState, useRef, useEffect } from "react";
import {
  Eye, EyeOff, Mail, Lock, User, UserCheck, X, ChevronLeft,
  CheckCircle, AlertCircle, Loader2, RefreshCw, KeyRound, Shield,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type AuthScreen =
  | "login"
  | "signup"
  | "verifyCode"
  | "forgotPassword"
  | "newPassword"
  | "success";

type VerifyPurpose = "signup" | "passwordReset";

interface AuthFlowProps {
  initialScreen?: "login" | "signup";
  onClose: () => void;
  onSuccess: () => void;
  reason?: "profile" | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getPasswordStrength(password: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (!password) return { level: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { level: 1, label: "ضعیف" };
  if (score === 2) return { level: 2, label: "متوسط" };
  return { level: 3, label: "قوی" };
}

const strengthColors: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-amber-400",
  3: "bg-emerald-500",
};

const strengthTextColors: Record<number, string> = {
  1: "text-red-400",
  2: "text-amber-400",
  3: "text-emerald-400",
};

// ── Reusable Input ────────────────────────────────────────────────────────────

function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  suffix,
  autoFocus,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  suffix?: React.ReactNode;
  autoFocus?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-white/70 dark:text-white/70 light:text-black/70 text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
              error ? "text-red-400" : "text-white/30 dark:text-white/30 light:text-black/30"
            }`}
          />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          dir="ltr"
          className={`w-full bg-white/5 dark:bg-white/5 light:bg-black/5 border rounded-xl ${
            Icon ? "pr-10" : "pr-4"
          } ${suffix ? "pl-12" : "pl-4"} py-3 text-foreground placeholder:text-white/25 dark:placeholder:text-white/25 light:placeholder:text-black/25 text-sm focus:outline-none transition-all ${
            error
              ? "border-red-500/60 focus:border-red-400 bg-red-500/5"
              : "border-white/12 dark:border-white/12 light:border-black/12 focus:border-primary/50 focus:bg-primary/5"
          }`}
        />
        {suffix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-red-400 text-xs">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

// ── OTP Input ─────────────────────────────────────────────────────────────────

function OTPInput({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = value.slice(0, index) + value.slice(index + 1);
        onChange(next.padEnd(index, " ").replace(/ /g, "").slice(0, 6));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = value.slice(0, index - 1) + value.slice(index);
        onChange(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleChange(index: number, raw: string) {
    const char = raw.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const arr = [...digits];
    arr[index] = char;
    const next = arr.join("").replace(/ /g, "").slice(0, 6);
    onChange(next);
    if (index < 5) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    setTimeout(() => inputRefs.current[focusIdx]?.focus(), 0);
  }

  return (
    <div className="flex gap-2 justify-center" dir="ltr">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ""}
          onPaste={handlePaste}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 focus:outline-none transition-all ${
            hasError
              ? "border-red-500/60 text-red-400"
              : digits[i]
              ? "border-primary/60 text-white dark:text-white light:text-black shadow-sm shadow-primary/20"
              : "border-white/12 dark:border-white/12 light:border-black/12 text-foreground focus:border-primary/50"
          }`}
        />
      ))}
    </div>
  );
}

// ── Countdown Timer ──────────────────────────────────────────────────────────

function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active || seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, active]);

  function restart() {
    setSeconds(initial);
    setActive(true);
  }

  return { seconds, expired: seconds <= 0, restart };
}

// ── Glassmorphism Card ────────────────────────────────────────────────────────

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative backdrop-blur-2xl rounded-2xl border border-white/12 dark:border-white/12 light:border-black/15 shadow-2xl shadow-black/60 overflow-hidden bg-[rgba(26,26,26,0.97)] dark:bg-[rgba(26,26,26,0.97)] light:bg-[rgba(248,246,255,0.98)]">

      {/* Top purple glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      {/* Subtle corner glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-violet-600/6 blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ── AuthFlow Main Component ───────────────────────────────────────────────────

export function AuthFlow({ initialScreen = "login", onClose, onSuccess, reason }: AuthFlowProps) {
  const [screen, setScreen] = useState<AuthScreen>(initialScreen);
  const [verifyPurpose, setVerifyPurpose] = useState<VerifyPurpose>("signup");

  // Shared email for flows
  const [flowEmail, setFlowEmail] = useState("");

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  const backdrop = (
    <div
      className="fixed inset-0 bg-black/80 dark:bg-black/80 light:bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-6 overflow-y-auto"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-md my-auto" onClick={(e) => e.stopPropagation()}>
        {/* Logo */}
        <div className="text-center mb-6">
          <span
            className="text-2xl font-black tracking-tight"
            style={{
              fontFamily: "'Vazirmatn', sans-serif",
              background: "linear-gradient(135deg, #8B5CF6 0%, #E50914 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CineMatch
          </span>
        </div>

        <AuthCard>
          {screen === "login" && (
            <LoginScreen
              onSuccess={onSuccess}
              onGoSignup={() => setScreen("signup")}
              onForgot={() => setScreen("forgotPassword")}
              onClose={onClose}
              reason={reason}
            />
          )}
          {screen === "signup" && (
            <SignupScreen
              onNext={(email) => { setFlowEmail(email); setVerifyPurpose("signup"); setScreen("verifyCode"); }}
              onGoLogin={() => setScreen("login")}
              onClose={onClose}
            />
          )}
          {screen === "verifyCode" && (
            <VerifyCodeScreen
              email={flowEmail}
              purpose={verifyPurpose}
              onSuccess={() => {
                if (verifyPurpose === "signup") {
                  onSuccess();
                } else {
                  setScreen("newPassword");
                }
              }}
              onBack={() => setScreen(verifyPurpose === "signup" ? "signup" : "forgotPassword")}
              onClose={onClose}
            />
          )}
          {screen === "forgotPassword" && (
            <ForgotPasswordScreen
              onNext={(email) => { setFlowEmail(email); setVerifyPurpose("passwordReset"); setScreen("verifyCode"); }}
              onBack={() => setScreen("login")}
              onClose={onClose}
            />
          )}
          {screen === "newPassword" && (
            <NewPasswordScreen
              onSuccess={() => setScreen("success")}
              onClose={onClose}
            />
          )}
          {screen === "success" && (
            <SuccessScreen
              onGoLogin={() => setScreen("login")}
              onClose={onClose}
            />
          )}
        </AuthCard>
      </div>
    </div>
  );

  return backdrop;
}

// ── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen({
  onSuccess,
  onGoSignup,
  onForgot,
  onClose,
  reason,
}: {
  onSuccess: () => void;
  onGoSignup: () => void;
  onForgot: () => void;
  onClose: () => void;
  reason?: "profile" | null;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!identifier.trim()) e.identifier = "نام کاربری یا ایمیل الزامی است";
    if (!password) e.password = "رمز عبور الزامی است";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1000);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-white dark:text-white light:text-black/90" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            ورود به حساب کاربری
          </h1>
          <p className="text-white/35 dark:text-white/35 light:text-black/40 text-xs mt-1">
            خوش برگشتی! وارد شو و ادامه بده
          </p>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/70 dark:hover:text-white/70 light:hover:text-black/70 transition-colors p-1">
          <X size={18} />
        </button>
      </div>

      {reason === "profile" && (
        <div className="mb-5 px-4 py-3 bg-primary/10 border border-primary/25 rounded-xl flex items-center gap-2.5">
          <Shield size={14} className="text-primary flex-shrink-0" />
          <p className="text-primary text-sm">برای دسترسی به پروفایل خود وارد شوید</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <AuthInput
          label="نام کاربری یا ایمیل"
          placeholder="example@email.com"
          value={identifier}
          onChange={setIdentifier}
          error={errors.identifier}
          icon={User}
          autoFocus
        />
        <AuthInput
          label="رمز عبور"
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          error={errors.password}
          icon={Lock}
          suffix={
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="text-white/30 dark:text-white/30 light:text-black/30 hover:text-white/60 dark:hover:text-white/60 light:hover:text-black/60 transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-6 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: loading
              ? "linear-gradient(135deg, rgba(139,92,246,0.5) 0%, rgba(229,9,20,0.4) 100%)"
              : "linear-gradient(135deg, #8B5CF6 0%, #E50914 100%)",
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
          {loading ? "در حال ورود..." : "ورود"}
        </button>

        <p className="text-white/30 dark:text-white/30 light:text-black/40 text-xs text-center pt-1">
          حساب کاربری ندارید؟{" "}
          <button type="button" onClick={onGoSignup} className="text-primary hover:text-violet-400 transition-colors font-medium">
            ایجاد حساب کاربری
          </button>
        </p>
      </form>
    </div>
  );
}

// ── Signup Screen ─────────────────────────────────────────────────────────────

function SignupScreen({
  onNext,
  onGoLogin,
  onClose,
}: {
  onNext: (email: string) => void;
  onGoLogin: () => void;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = getPasswordStrength(password);

  const TAKEN_USERNAMES = ["admin", "user", "test", "cinématch"];

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "نام و نام خانوادگی الزامی است";
    if (!username.trim()) e.username = "نام کاربری الزامی است";
    else if (username.length < 3) e.username = "نام کاربری باید حداقل ۳ کاراکتر باشد";
    else if (TAKEN_USERNAMES.includes(username.toLowerCase())) e.username = "این نام کاربری قبلاً استفاده شده است";
    if (!email.trim()) e.email = "ایمیل الزامی است";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "فرمت ایمیل معتبر نیست";
    if (!password) e.password = "رمز عبور الزامی است";
    else if (password.length < 8) e.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    if (!confirmPassword) e.confirmPassword = "تأیید رمز عبور الزامی است";
    else if (password !== confirmPassword) e.confirmPassword = "رمزهای عبور مطابقت ندارند";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(email); }, 900);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            ایجاد حساب کاربری
          </h1>
          <p className="text-white/35 dark:text-white/35 light:text-black/40 text-xs mt-1">
            به جمع سینمادوستان بپیوند
          </p>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <AuthInput
          label="نام و نام خانوادگی"
          placeholder="علی محمدی"
          value={fullName}
          onChange={setFullName}
          error={errors.fullName}
          icon={UserCheck}
          autoFocus
        />
        <AuthInput
          label="نام کاربری"
          placeholder="cinema_lover"
          value={username}
          onChange={setUsername}
          error={errors.username}
          icon={User}
        />
        <AuthInput
          label="ایمیل"
          placeholder="example@email.com"
          value={email}
          onChange={setEmail}
          error={errors.email}
          icon={Mail}
        />
        <div className="space-y-1.5">
          <AuthInput
            label="رمز عبور"
            type={showPass ? "text" : "password"}
            placeholder="حداقل ۸ کاراکتر"
            value={password}
            onChange={setPassword}
            error={errors.password}
            icon={Lock}
            suffix={
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          {password && (
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      strength.level >= lvl ? strengthColors[strength.level] : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs ${strengthTextColors[strength.level] || "text-white/30"}`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>
        <AuthInput
          label="تأیید رمز عبور"
          type={showConfirm ? "text" : "password"}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
          icon={Lock}
          suffix={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #E50914 100%)",
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
          {loading ? "در حال ایجاد حساب..." : "ایجاد حساب کاربری"}
        </button>

        <p className="text-white/30 dark:text-white/30 light:text-black/40 text-xs text-center">
          حساب کاربری دارید؟{" "}
          <button type="button" onClick={onGoLogin} className="text-primary hover:text-violet-400 transition-colors font-medium">
            ورود به حساب کاربری
          </button>
        </p>
      </form>
    </div>
  );
}

// ── Forgot Password Screen ─────────────────────────────────────────────────────

function ForgotPasswordScreen({
  onNext,
  onBack,
  onClose,
}: {
  onNext: (email: string) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("ایمیل الزامی است"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("فرمت ایمیل معتبر نیست"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(email); }, 900);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm">
          <ChevronLeft size={16} />
          بازگشت
        </button>
        <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1">
          <X size={18} />
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(229,9,20,0.15) 100%)", border: "1px solid rgba(139,92,246,0.3)" }}>
          <Mail size={24} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
          بازیابی رمز عبور
        </h1>
        <p className="text-white/40 dark:text-white/40 light:text-black/45 text-sm leading-relaxed">
          ایمیل خود را وارد کنید.<br />کد تأیید برایتان ارسال می‌شود.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <AuthInput
          label="ایمیل"
          placeholder="example@email.com"
          value={email}
          onChange={setEmail}
          error={error}
          icon={Mail}
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #E50914 100%)" }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
          {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
        </button>
      </form>
    </div>
  );
}

// ── Verify Code Screen ────────────────────────────────────────────────────────

function VerifyCodeScreen({
  email,
  purpose,
  onSuccess,
  onBack,
  onClose,
}: {
  email: string;
  purpose: VerifyPurpose;
  onSuccess: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { seconds, expired, restart } = useCountdown(120);

  const DEMO_CODE = "123456";

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6) { setHasError(true); setErrorMsg("لطفاً کد ۶ رقمی را کامل وارد کنید"); return; }
    if (code !== DEMO_CODE) { setHasError(true); setErrorMsg("کد وارد شده اشتباه است. (کد نمونه: ۱۲۳۴۵۶)"); return; }
    setHasError(false);
    setErrorMsg("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 800);
  }

  function handleResend() {
    if (!expired) return;
    setCode("");
    setHasError(false);
    setErrorMsg("");
    restart();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm">
          <ChevronLeft size={16} />
          بازگشت
        </button>
        <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1">
          <X size={18} />
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(229,9,20,0.15) 100%)", border: "1px solid rgba(139,92,246,0.3)" }}>
          <Shield size={24} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
          {purpose === "signup" ? "تأیید ایمیل" : "تأیید کد بازیابی"}
        </h1>
        <p className="text-white/40 dark:text-white/40 light:text-black/45 text-sm leading-relaxed">
          {purpose === "signup"
            ? "کد تأیید به آدرس زیر ارسال شد:"
            : "کد بازیابی رمز عبور به آدرس زیر ارسال شد:"}
        </p>
        <p className="text-primary text-sm font-medium mt-1 dir-ltr" dir="ltr">{email || "your@email.com"}</p>
        <p className="text-white/25 text-xs mt-3">(کد نمونه برای تست: ۱۲۳۴۵۶)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        <OTPInput value={code} onChange={setCode} hasError={hasError} />

        {errorMsg && (
          <p className="flex items-center justify-center gap-1.5 text-red-400 text-xs text-center">
            <AlertCircle size={12} />
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #E50914 100%)" }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          {loading ? "در حال تأیید..." : "تأیید کد"}
        </button>

        <div className="flex items-center justify-center gap-3 text-sm">
          {!expired ? (
            <span className="text-white/30 dark:text-white/30 light:text-black/40 text-xs">
              ارسال مجدد تا{" "}
              <span className="text-primary/70 font-mono">{formatTime(seconds)}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="flex items-center gap-1.5 text-primary hover:text-violet-400 transition-colors text-xs"
            >
              <RefreshCw size={12} />
              ارسال مجدد کد
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ── New Password Screen ────────────────────────────────────────────────────────

function NewPasswordScreen({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = getPasswordStrength(password);

  function validate() {
    const e: Record<string, string> = {};
    if (!password) e.password = "رمز عبور جدید الزامی است";
    else if (password.length < 8) e.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    if (!confirmPassword) e.confirmPassword = "تأیید رمز عبور الزامی است";
    else if (password !== confirmPassword) e.confirmPassword = "رمزهای عبور مطابقت ندارند";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 900);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <div />
        <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1">
          <X size={18} />
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(229,9,20,0.15) 100%)", border: "1px solid rgba(139,92,246,0.3)" }}>
          <Lock size={24} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
          رمز عبور جدید
        </h1>
        <p className="text-white/40 dark:text-white/40 light:text-black/45 text-sm">
          رمز عبور جدید خود را تنظیم کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <div className="space-y-1.5">
          <AuthInput
            label="رمز عبور جدید"
            type={showPass ? "text" : "password"}
            placeholder="حداقل ۸ کاراکتر"
            value={password}
            onChange={setPassword}
            error={errors.password}
            icon={Lock}
            autoFocus
            suffix={
              <button type="button" onClick={() => setShowPass((v) => !v)} className="text-white/30 hover:text-white/60 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          {password && (
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3].map((lvl) => (
                  <div key={lvl} className={`h-1 flex-1 rounded-full transition-all ${strength.level >= lvl ? strengthColors[strength.level] : "bg-white/10"}`} />
                ))}
              </div>
              <span className={`text-xs ${strengthTextColors[strength.level] || "text-white/30"}`}>{strength.label}</span>
            </div>
          )}
        </div>

        <AuthInput
          label="تأیید رمز عبور جدید"
          type={showConfirm ? "text" : "password"}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
          icon={Lock}
          suffix={
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-white/30 hover:text-white/60 transition-colors">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #E50914 100%)" }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          {loading ? "در حال ذخیره..." : "ذخیره رمز عبور جدید"}
        </button>
      </form>
    </div>
  );
}

// ── Success Screen ─────────────────────────────────────────────────────────────

function SuccessScreen({
  onGoLogin,
  onClose,
}: {
  onGoLogin: () => void;
  onClose: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <button onClick={onClose} className="absolute top-4 left-4 text-white/30 hover:text-white/70 transition-colors p-1">
        <X size={18} />
      </button>

      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.15) 100%)", border: "1px solid rgba(16,185,129,0.4)" }}>
        <CheckCircle size={28} className="text-emerald-400" />
      </div>

      <h1 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
        رمز عبور تغییر کرد!
      </h1>
      <p className="text-white/40 dark:text-white/40 light:text-black/45 text-sm leading-relaxed mb-8">
        رمز عبور شما با موفقیت تغییر یافت.<br />
        اکنون می‌توانید با رمز جدید وارد شوید.
      </p>

      <button
        onClick={onGoLogin}
        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
        style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #E50914 100%)" }}
      >
        <KeyRound size={16} />
        ورود به حساب کاربری
      </button>
    </div>
  );
}
