import { Bell, Heart, MessageCircle, Users, Star, Tv, Award, Settings, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { useState } from 'react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'recommendation' | 'award' | 'series';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link: string;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      title: 'لایک جدید',
      message: 'علی احمدی نقد شما برای فیلم اینترستلار را لایک کرد',
      time: '۲ دقیقه پیش',
      isRead: false,
      link: '/review/1',
    },
    {
      id: '2',
      type: 'comment',
      title: 'پاسخ جدید',
      message: 'محمد رضایی به نظر شما پاسخ داد',
      time: '۱ ساعت پیش',
      isRead: false,
      link: '/review/2',
    },
    {
      id: '3',
      type: 'follow',
      title: 'دنبال‌کننده جدید',
      message: 'سارا محمدی شما را دنبال کرد',
      time: '۳ ساعت پیش',
      isRead: true,
      link: '/user/3',
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'پیشنهاد ویژه',
      message: 'بر اساس سلیقه شما، فیلم "دون: قسمت دوم" را پیشنهاد می‌کنیم',
      time: '۵ ساعت پیش',
      isRead: true,
      link: '/movie/4',
    },
    {
      id: '5',
      type: 'series',
      title: 'فصل جدید',
      message: 'فصل ۳ سریال "بریکینگ بد" منتشر شد',
      time: '۱ روز پیش',
      isRead: true,
      link: '/series/1',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'recommendation':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'award':
        return <Award className="w-4 h-4 text-orange-500" />;
      case 'series':
        return <Tv className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[600px] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <div className="flex items-center gap-3">
                <h3 className="font-bold">اعلان‌ها</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    خواندن همه
                  </button>
                )}
                <Link
                  to="/notifications"
                  onClick={onClose}
                  className="text-xs text-primary hover:underline"
                >
                  مشاهده همه
                </Link>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">اعلانی ندارید</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative ${
                      !notification.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <Link
                      to={notification.link}
                      onClick={() => {
                        markAsRead(notification.id);
                        onClose();
                      }}
                      className="block p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-sm font-medium">{notification.title}</span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
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
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border bg-card sticky bottom-0">
                <Link
                  to="/settings/notifications"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>تنظیمات اعلان‌ها</span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
