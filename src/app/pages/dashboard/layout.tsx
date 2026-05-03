import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, Heart, BookMarked, Clock, Star, MessageCircle, Users, List, Bell, Mail, Shield, Lock, CreditCard, Crown, HelpCircle, LogOut, User, Settings } from 'lucide-react';

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'خانه', path: '/dashboard' },
    { icon: <User className="w-5 h-5" />, label: 'پروفایل', path: '/dashboard/profile' },
    { icon: <BookMarked className="w-5 h-5" />, label: 'لیست تماشا', path: '/dashboard/watchlist' },
    { icon: <Heart className="w-5 h-5" />, label: 'علاقه‌مندی‌ها', path: '/dashboard/favorites' },
    { icon: <Clock className="w-5 h-5" />, label: 'تاریخچه', path: '/dashboard/history' },
    { icon: <Star className="w-5 h-5" />, label: 'امتیازدهی‌ها', path: '/dashboard/ratings' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'نقدها', path: '/dashboard/reviews' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'نظرات', path: '/dashboard/comments' },
    { icon: <Users className="w-5 h-5" />, label: 'دنبال‌کنندگان', path: '/dashboard/followers' },
    { icon: <Users className="w-5 h-5" />, label: 'دنبال‌شوندگان', path: '/dashboard/following' },
    { icon: <List className="w-5 h-5" />, label: 'لیست‌ها', path: '/dashboard/lists' },
    { icon: <Star className="w-5 h-5" />, label: 'پیشنهادها', path: '/dashboard/recommendations' },
    { icon: <Bell className="w-5 h-5" />, label: 'اعلان‌ها', path: '/dashboard/notifications' },
    { icon: <Mail className="w-5 h-5" />, label: 'پیام‌ها', path: '/dashboard/messages' },
    { icon: <Shield className="w-5 h-5" />, label: 'حریم خصوصی', path: '/dashboard/privacy' },
    { icon: <Lock className="w-5 h-5" />, label: 'امنیت', path: '/dashboard/security' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'پرداخت‌ها', path: '/dashboard/billing' },
    { icon: <Crown className="w-5 h-5" />, label: 'اشتراک VIP', path: '/dashboard/vip' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'راهنما', path: '/dashboard/help' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden lg:block w-72 fixed right-0 top-0 h-screen bg-card border-l border-border overflow-y-auto">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">دیدار</span>
            </Link>

            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-destructive transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 lg:mr-72 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
