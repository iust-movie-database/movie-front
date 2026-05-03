import { Heart, BookMarked, Star, Clock } from 'lucide-react';

export function DashboardOverview() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">خوش آمدید، علی!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <BookMarked className="w-6 h-6" />, label: 'لیست تماشا', value: '45', color: 'from-blue-500 to-cyan-500' },
          { icon: <Heart className="w-6 h-6" />, label: 'علاقه‌مندی‌ها', value: '128', color: 'from-red-500 to-pink-500' },
          { icon: <Star className="w-6 h-6" />, label: 'امتیازدهی‌ها', value: '256', color: 'from-yellow-500 to-orange-500' },
          { icon: <Clock className="w-6 h-6" />, label: 'دیده‌شده', value: '189', color: 'from-purple-500 to-pink-500' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 bg-gradient-to-br ${stat.color} rounded-2xl text-white`}>
            <div className="mb-4">{stat.icon}</div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-white/80">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card p-8 rounded-3xl border border-border">
        <h2 className="text-2xl font-bold mb-4">فعالیت اخیر</h2>
        <p className="text-muted-foreground">فعالیت‌های شما در اینجا نمایش داده می‌شود</p>
      </div>
    </div>
  );
}
