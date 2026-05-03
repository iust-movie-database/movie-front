import { useState } from 'react';
import { Search, Moon, Sun, User, Menu, X, Film, Tv, Star, Award, Users, TrendingUp, Bell, LogOut, Settings, Heart, BookMarked, Clock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoggedIn] = useState(false); // Toggle this to test logged in state

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent">
                    دیدار
                  </span>
                  <span className="text-[10px] text-muted-foreground -mt-1">مرجع فارسی فیلم و سریال</span>
                </div>
              </Link>

              <div className="hidden xl:flex items-center gap-1">
                <NavLink to="/discover" icon={<Star className="w-4 h-4" />} label="کشف کن" />
                <NavLink to="/movies" icon={<Film className="w-4 h-4" />} label="فیلم‌ها" />
                <NavLink to="/series" icon={<Tv className="w-4 h-4" />} label="سریال‌ها" />
                <NavLink to="/actors" icon={<Users className="w-4 h-4" />} label="بازیگران" />
                <NavLink to="/genres" icon={<TrendingUp className="w-4 h-4" />} label="ژانرها" />
                <NavLink to="/awards" icon={<Award className="w-4 h-4" />} label="جوایز" />
                <NavLink to="/community" icon={<Users className="w-4 h-4" />} label="جامعه" />
                <NavLink to="/news" icon={<TrendingUp className="w-4 h-4" />} label="اخبار" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-3 bg-muted/50 hover:bg-muted px-4 py-2.5 rounded-2xl transition-all group"
              >
                <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground">جستجو در دیدار...</span>
                <kbd className="px-2 py-1 bg-background rounded-lg text-xs text-muted-foreground border border-border">
                  /
                </kbd>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-all hover:scale-105 active:scale-95"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-accent" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
              </button>

              {isLoggedIn ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                    </button>
                    {isNotificationOpen && (
                      <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                    )}
                  </div>

                  <div className="relative hidden md:block">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-2 p-1.5 pr-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">علی احمدی</span>
                    </button>
                    {isProfileMenuOpen && (
                      <ProfileDropdown onClose={() => setIsProfileMenuOpen(false)} />
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-l from-primary to-secondary rounded-2xl text-white hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">ورود / ثبت‌نام</span>
                </Link>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="xl:hidden p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t border-border bg-background"
            >
              <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-2">
                <MobileNavLink to="/discover" icon={<Star className="w-5 h-5" />} label="کشف کن" onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/movies" icon={<Film className="w-5 h-5" />} label="فیلم‌ها" onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/series" icon={<Tv className="w-5 h-5" />} label="سریال‌ها" onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/actors" icon={<Users className="w-5 h-5" />} label="بازیگران" onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/awards" icon={<Award className="w-5 h-5" />} label="جوایز" onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/community" icon={<Users className="w-5 h-5" />} label="جامعه" onClick={() => setIsMenuOpen(false)} />
                <MobileNavLink to="/news" icon={<TrendingUp className="w-5 h-5" />} label="اخبار" onClick={() => setIsMenuOpen(false)} />
                <div className="pt-4">
                  {!isLoggedIn ? (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-l from-primary to-secondary rounded-2xl text-white">
                      <User className="w-5 h-5" />
                      <span className="font-medium">ورود / ثبت‌نام</span>
                    </Link>
                  ) : (
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-l from-primary to-secondary rounded-2xl text-white">
                      <User className="w-5 h-5" />
                      <span className="font-medium">پنل کاربری</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-muted/50 transition-all group">
      <span className="text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {label}
      </span>
    </Link>
  );
}

function MobileNavLink({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-all">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const handleSuggestionClick = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-3xl mx-auto mt-24 px-4"
      >
        <div className="bg-card rounded-3xl shadow-2xl shadow-primary/20 border border-border overflow-hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-4 p-6 border-b border-border">
            <Search className="w-6 h-6 text-primary" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی فیلم، سریال، بازیگر..."
              className="flex-1 bg-transparent outline-none text-lg"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
          <div className="p-6 space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-3">جستجوهای پرطرفدار</div>
              <div className="flex flex-wrap gap-2">
                {['اینترستلار', 'بریکینگ بد', 'گادفادر', 'دارک نایت', 'شوالیه تاریکی'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-4 py-2 bg-muted rounded-xl text-sm hover:bg-primary hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute left-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">اعلان‌ها</h3>
          <button onClick={() => { navigate('/dashboard/notifications'); onClose(); }} className="text-sm text-primary hover:underline">
            مشاهده همه
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">نقد جدید برای فیلم اینترستلار</p>
                  <p className="text-xs text-muted-foreground mt-1">۲ ساعت پیش</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <User className="w-4 h-4" />, label: 'پروفایل من', path: '/dashboard/profile' },
    { icon: <Heart className="w-4 h-4" />, label: 'علاقه‌مندی‌ها', path: '/dashboard/favorites' },
    { icon: <BookMarked className="w-4 h-4" />, label: 'لیست تماشا', path: '/dashboard/watchlist' },
    { icon: <Clock className="w-4 h-4" />, label: 'تاریخچه', path: '/dashboard/history' },
    { icon: <Settings className="w-4 h-4" />, label: 'تنظیمات', path: '/dashboard/security' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute left-0 mt-2 w-64 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">علی احمدی</div>
              <div className="text-xs text-muted-foreground truncate">ali@example.com</div>
            </div>
          </div>
        </div>
        <div className="py-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <span className="text-muted-foreground">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-border">
          <button
            onClick={() => { navigate('/'); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">خروج</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}
