import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, X, Loader2 } from "lucide-react";
import { login, signup, saveUserData } from "../../services/api";

// ── Types ────────────────────────────────────────────────────────────────────

type AuthScreen = "login" | "signup";

interface AuthFlowProps {
  initialScreen?: "login" | "signup";
  onClose: () => void;
  onSuccess: () => void;
  reason?: "profile" | null;
}

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
          {error}
        </p>
      )}
    </div>
  );
}

// ── Glassmorphism Card ────────────────────────────────────────────────────────

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative backdrop-blur-2xl rounded-2xl border border-white/12 dark:border-white/12 light:border-black/15 shadow-2xl shadow-black/60 overflow-hidden bg-[rgba(26,26,26,0.97)] dark:bg-[rgba(26,26,26,0.97)] light:bg-[rgba(248,246,255,0.98)]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-violet-600/6 blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen({
  onSuccess,
  onGoSignup,
  onClose,
}: {
  onSuccess: () => void;
  onGoSignup: () => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("ایمیل الزامی است");
      return;
    }
    if (!password) {
      setError("رمز عبور الزامی است");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const response = await login({ email, password });
      saveUserData(response);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "ایمیل یا رمز عبور اشتباه است");
    } finally {
      setLoading(false);
    }
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

      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        <AuthInput
          label="ایمیل"
          placeholder="example@email.com"
          value={email}
          onChange={setEmail}
          error={error && !email ? error : ""}
          icon={Mail}
          autoFocus
        />
        <AuthInput
          label="رمز عبور"
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          error={error && !password ? error : ""}
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

        {error && (
          <p className="text-red-400 text-xs text-center">{error}</p>
        )}

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
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
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
  onSuccess,
  onGoLogin,
  onClose,
}: {
  onSuccess: () => void;
  onGoLogin: () => void;
  onClose: () => void;
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("نام کاربری الزامی است");
      return;
    }
    if (!email.trim()) {
      setError("ایمیل الزامی است");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("فرمت ایمیل معتبر نیست");
      return;
    }
    if (!password) {
      setError("رمز عبور الزامی است");
      return;
    }
    if (password.length < 8) {
      setError("رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const response = await signup({ username, email, password });
      saveUserData(response);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "خطا در ایجاد حساب کاربری");
    } finally {
      setLoading(false);
    }
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
          label="نام کاربری"
          placeholder="cinema_lover"
          value={username}
          onChange={setUsername}
          icon={User}
          autoFocus
        />
        <AuthInput
          label="ایمیل"
          placeholder="example@email.com"
          value={email}
          onChange={setEmail}
          icon={Mail}
        />
        <AuthInput
          label="رمز عبور"
          type={showPass ? "text" : "password"}
          placeholder="حداقل ۸ کاراکتر"
          value={password}
          onChange={setPassword}
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

        {error && (
          <p className="text-red-400 text-xs text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #E50914 100%)",
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
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

// ── AuthFlow Main Component ───────────────────────────────────────────────────

export function AuthFlow({ initialScreen = "login", onClose, onSuccess }: AuthFlowProps) {
  const [screen, setScreen] = useState<AuthScreen>(initialScreen);

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 dark:bg-black/80 light:bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-6 overflow-y-auto"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-md my-auto" onClick={(e) => e.stopPropagation()}>
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
              onClose={onClose}
            />
          )}
          {screen === "signup" && (
            <SignupScreen
              onSuccess={onSuccess}
              onGoLogin={() => setScreen("login")}
              onClose={onClose}
            />
          )}
        </AuthCard>
      </div>
    </div>
  );
}