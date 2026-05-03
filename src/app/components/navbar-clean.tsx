import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Bell, User, ChevronDown, Heart, BookMarked, MessageCircle, Settings as SettingsIcon, Crown, LogOut, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router';
import { NotificationDropdown } from './notification-dropdown';
import { useAuth } from '../contexts/auth-context';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, unreadNotifications } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'خانه' },
    { to: '/movies', label: 'فیلم‌ها' },
    { to: '/series', label: 'سریال‌ها' },
    { to: '/awards', label: 'جوایز' },
    { to: '/discover', label: 'کشف کن' },
    { to: '/reviews', label: 'نقدها' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-background/80 backdrop-blur-xl'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold">دیدار</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    location.pathname === link.to
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-muted rounded-xl transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 hover:bg-muted rounded-xl transition-all"
              >
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 hover:bg-muted rounded-xl transition-all"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {isAuthenticated ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative p-2.5 hover:bg-muted rounded-xl transition-all"
                    >
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      {unreadNotifications > 0 && (
                        <>
                          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                            {unreadNotifications}
                          </span>
                        </>
                      )}
                    </button>
                    <NotificationDropdown
                      isOpen={isNotificationOpen}
                      onClose={() => setIsNotificationOpen(false)}
                    />
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 hover:bg-muted rounded-xl transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium hidden md:block">{user?.username || user?.firstName}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
                    </button>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                          >
                            <div className="p-4 border-b border-border">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold truncate">{user?.name}</div>
                                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                                </div>
                              </div>
                            </div>

                            <div className="py-2">
                              <ProfileMenuItem
                                icon={<User className="w-4 h-4" />}
                                label="پروفایل من"
                                onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                              />
                              <ProfileMenuItem
                                icon={<BookMarked className="w-4 h-4" />}
                                label="لیست تماشا"
                                onClick={() => { navigate('/profile?tab=watchlist'); setIsProfileMenuOpen(false); }}
                              />
                              <ProfileMenuItem
                                icon={<Heart className="w-4 h-4" />}
                                label="علاقه‌مندی‌ها"
                                onClick={() => { navigate('/profile?tab=favorites'); setIsProfileMenuOpen(false); }}
                              />
                              <ProfileMenuItem
                                icon={<MessageCircle className="w-4 h-4" />}
                                label="نقدها"
                                onClick={() => { navigate('/profile?tab=reviews'); setIsProfileMenuOpen(false); }}
                              />
                              <ProfileMenuItem
                                icon={<SettingsIcon className="w-4 h-4" />}
                                label="تنظیمات"
                                onClick={() => { navigate('/profile?tab=settings'); setIsProfileMenuOpen(false); }}
                              />
                              <ProfileMenuItem
                                icon={<Crown className="w-4 h-4 text-primary" />}
                                label="اشتراک VIP"
                                onClick={() => { navigate('/vip'); setIsProfileMenuOpen(false); }}
                                highlight
                              />
                            </div>

                            <div className="p-2 border-t border-border">
                              <button
                                onClick={() => {
                                  logout();
                                  setIsProfileMenuOpen(false);
                                  navigate('/');
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 rounded-xl transition-all text-red-500"
                              >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">خروج</span>
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-xl transition-all"
                  >
                    ورود
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-l from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
                  >
                    ثبت‌نام
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-border"
              >
                <div className="py-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-6 py-3 rounded-xl transition-all ${
                        location.pathname === link.to
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground/70 hover:bg-muted'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function ProfileMenuItem({ icon, label, onClick, highlight }: { icon: React.ReactNode; label: string; onClick: () => void; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-all ${
        highlight ? 'text-primary' : ''
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32 px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-4 p-6">
            <Search className="w-6 h-6 text-primary" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی فیلم، سریال، بازیگر..."
              className="flex-1 bg-transparent outline-none text-lg"
            />
          </form>

          {searchQuery === '' && (
            <div className="p-6 pt-0">
              <div className="text-sm text-muted-foreground mb-3">جستجوهای پرطرفدار</div>
              <div className="flex flex-wrap gap-2">
                {['اینترستلار', 'بریکینگ بد', 'گادفادر', 'دارک نایت'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      handleSearch(new Event('submit') as any);
                    }}
                    className="px-4 py-2 bg-muted rounded-xl text-sm hover:bg-primary hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
