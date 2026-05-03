import { useState } from 'react';
import { Search, Moon, Sun, User, Menu, X, Film, Tv, Star, Award, Users, TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent">
                    دیدار
                  </span>
                  <span className="text-[10px] text-muted-foreground -mt-1">مرجع فارسی فیلم و سریال</span>
                </div>
              </div>

              <div className="hidden xl:flex items-center gap-1">
                <NavLink icon={<Film className="w-4 h-4" />} label="فیلم‌ها" />
                <NavLink icon={<Tv className="w-4 h-4" />} label="سریال‌ها" />
                <NavLink icon={<Users className="w-4 h-4" />} label="بازیگران" />
                <NavLink icon={<Award className="w-4 h-4" />} label="جوایز" />
                <NavLink icon={<TrendingUp className="w-4 h-4" />} label="ترندها" />
                <NavLink icon={<Star className="w-4 h-4" />} label="کشف کن" />
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

              <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-l from-primary to-secondary rounded-2xl text-white hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">ورود / ثبت‌نام</span>
              </button>

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
                <MobileNavLink icon={<Film className="w-5 h-5" />} label="فیلم‌ها" />
                <MobileNavLink icon={<Tv className="w-5 h-5" />} label="سریال‌ها" />
                <MobileNavLink icon={<Users className="w-5 h-5" />} label="بازیگران" />
                <MobileNavLink icon={<Award className="w-5 h-5" />} label="جوایز" />
                <MobileNavLink icon={<TrendingUp className="w-5 h-5" />} label="ترندها" />
                <MobileNavLink icon={<Star className="w-5 h-5" />} label="کشف کن" />
                <div className="pt-4 md:hidden">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-l from-primary to-secondary rounded-2xl text-white">
                    <User className="w-5 h-5" />
                    <span className="font-medium">ورود / ثبت‌نام</span>
                  </button>
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

function NavLink({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-muted/50 transition-all group">
      <span className="text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {label}
      </span>
    </button>
  );
}

function MobileNavLink({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-all">
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
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
          <div className="flex items-center gap-4 p-6 border-b border-border">
            <Search className="w-6 h-6 text-primary" />
            <input
              autoFocus
              type="text"
              placeholder="جستجوی فیلم، سریال، بازیگر..."
              className="flex-1 bg-transparent outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-3">جستجوهای پرطرفدار</div>
              <div className="flex flex-wrap gap-2">
                {['اینترستلار', 'بریکینگ بد', 'گادفادر', 'دارک نایت', 'شوالیه تاریکی'].map((term) => (
                  <button
                    key={term}
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
