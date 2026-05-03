import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { Bell, Heart, MessageCircle, Users, Star, Tv, Award, Check, Trash2, Filter, Search } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'recommendation' | 'award' | 'series' | 'system';
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  link: string;
}

export function NotificationsCenterPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      title: 'لایک جدید',
      message: 'علی احمدی نقد شما برای فیلم اینترستلار را لایک کرد',
      time: '۲ دقیقه پیش',
      date: 'امروز',
      isRead: false,
      link: '/review/1',
    },
    {
      id: '2',
      type: 'comment',
      title: 'پاسخ جدید',
      message: 'محمد رضایی به نظر شما پاسخ داد',
      time: '۱ ساعت پیش',
      date: 'امروز',
      isRead: false,
      link: '/review/2',
    },
    {
      id: '3',
      type: 'follow',
      title: 'دنبال‌کننده جدید',
      message: 'سارا محمدی شما را دنبال کرد',
      time: '۳ ساعت پیش',
      date: 'امروز',
      isRead: true,
      link: '/user/3',
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'پیشنهاد ویژه',
      message: 'بر اساس سلیقه شما، فیلم "دون: قسمت دوم" را پیشنهاد می‌کنیم',
      time: '۵ ساعت پیش',
      date: 'امروز',
      isRead: true,
      link: '/movie/4',
    },
    {
      id: '5',
      type: 'series',
      title: 'فصل جدید',
      message: 'فصل ۳ سریال "بریکینگ بد" منتشر شد',
      time: '۱ روز پیش',
      date: 'دیروز',
      isRead: true,
      link: '/series/1',
    },
    {
      id: '6',
      type: 'award',
      title: 'جایزه جدید',
      message: 'فیلم "اوپنهایمر" برنده اسکار بهترین فیلم شد',
      time: '۲ روز پیش',
      date: 'این هفته',
      isRead: true,
      link: '/award/1',
    },
    {
      id: '7',
      type: 'system',
      title: 'به‌روزرسانی سیستم',
      message: 'نسخه جدید دیدار با امکانات جدید منتشر شد',
      time: '۳ روز پیش',
      date: 'این هفته',
      isRead: true,
      link: '/about',
    },
  ]);

  const filters = [
    { id: 'all', label: 'همه', icon: <Bell className="w-4 h-4" /> },
    { id: 'like', label: 'لایک‌ها', icon: <Heart className="w-4 h-4" /> },
    { id: 'comment', label: 'نظرات', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'follow', label: 'دنبال‌کنندگان', icon: <Users className="w-4 h-4" /> },
    { id: 'recommendation', label: 'پیشنهادها', icon: <Star className="w-4 h-4" /> },
    { id: 'series', label: 'سریال‌ها', icon: <Tv className="w-4 h-4" /> },
    { id: 'award', label: 'جوایز', icon: <Award className="w-4 h-4" /> },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'recommendation':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'award':
        return <Award className="w-5 h-5 text-orange-500" />;
      case 'series':
        return <Tv className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  // Group by date
  const groupedNotifications = filteredNotifications.reduce((acc, notification) => {
    const date = notification.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">اعلان‌ها</h1>
              {unreadCount > 0 && (
                <p className="text-muted-foreground">
                  {unreadCount} اعلان خوانده نشده
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-all"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">خواندن همه</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  filter === f.id
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {f.icon}
                <span className="text-sm font-medium">{f.label}</span>
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {Object.keys(groupedNotifications).length === 0 ? (
            <div className="py-20 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">اعلانی ندارید</h3>
              <p className="text-muted-foreground">
                زمانی که اعلان جدیدی داشته باشید، اینجا نمایش داده می‌شود
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedNotifications).map(([date, notifs]) => (
                <div key={date}>
                  <h3 className="text-sm font-bold text-muted-foreground mb-4 sticky top-20 bg-background py-2">
                    {date}
                  </h3>
                  <div className="space-y-3">
                    {notifs.map((notification) => (
                      <div
                        key={notification.id}
                        className={`group relative p-6 rounded-2xl border transition-all ${
                          !notification.isRead
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-card border-border hover:border-primary/30'
                        }`}
                      >
                        <Link
                          to={notification.link}
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-start gap-4"
                        >
                          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="font-bold">{notification.title}</span>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-muted-foreground mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                          </div>
                        </Link>

                        {/* Action Buttons */}
                        <div className="absolute left-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 bg-card hover:bg-muted rounded-lg transition-colors"
                              title="علامت به عنوان خوانده شده"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 bg-card hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
