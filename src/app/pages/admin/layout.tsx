import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Users, Film, Tv, UserCircle, MessageCircle, Flag, BarChart3, Settings } from 'lucide-react';

export function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'داشبورد', path: '/admin' },
    { icon: <Users className="w-5 h-5" />, label: 'کاربران', path: '/admin/users' },
    { icon: <Film className="w-5 h-5" />, label: 'فیلم‌ها', path: '/admin/movies' },
    { icon: <Tv className="w-5 h-5" />, label: 'سریال‌ها', path: '/admin/series' },
    { icon: <UserCircle className="w-5 h-5" />, label: 'افراد', path: '/admin/people' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'نقدها', path: '/admin/reviews' },
    { icon: <Flag className="w-5 h-5" />, label: 'گزارش‌ها', path: '/admin/reports' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'آمار', path: '/admin/analytics' },
    { icon: <Settings className="w-5 h-5" />, label: 'تنظیمات', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-72 fixed right-0 top-0 h-screen bg-card border-l border-border overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary">پنل مدیریت</h2>
            </div>

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
            </div>
          </div>
        </aside>

        <main className="flex-1 mr-72 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
