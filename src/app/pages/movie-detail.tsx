import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { Heart, Bookmark, Share2, Star, Clock, Calendar, Award, TrendingUp, MessageCircle, ThumbsUp, Flag } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useState } from 'react';
import { MovieCard } from '../components/movie-card';

export function MovieDetailPage() {
  const { id } = useParams();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="relative h-[500px] lg:h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/40 to-background z-10" />
          <img
            src="/assets/banners/cinema-wide.jpg"
            alt="Backdrop"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative -mt-96 z-20">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-80 flex-shrink-0">
                <img
                  src="/assets/movies/space.jpg"
                  alt="Poster"
                  className="w-full rounded-3xl shadow-2xl"
                />
              </div>

              <div className="flex-1 pt-12">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-5xl font-bold mb-2">اینترستلار</h1>
                    <div className="text-2xl text-muted-foreground">Interstellar</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-xl border border-accent/30 rounded-2xl">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="text-lg font-bold text-accent">8.7</span>
                    <span className="text-sm text-muted-foreground">(۱.۸ میلیون رأی)</span>
                  </div>
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-2xl transition-all"
                  >
                    امتیاز دهید
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-8 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>۲۰۱۴</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>۱۶۹ دقیقه</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-muted rounded-lg text-sm">علمی-تخیلی</span>
                    <span className="px-3 py-1 bg-muted rounded-lg text-sm">ماجراجویی</span>
                    <span className="px-3 py-1 bg-muted rounded-lg text-sm">درام</span>
                  </div>
                </div>

                <p className="text-lg leading-relaxed mb-8">
                  گروهی از مسافران فضایی وارد یک کرم‌چاله در کنار زحل می‌شوند تا از گرسنگی و انقراض نسل بشر جلوگیری کنند. در این مسیر با چالش‌های بسیاری روبرو می‌شوند و باید تصمیمات سختی بگیرند.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <button
                    onClick={() => setIsInWatchlist(!isInWatchlist)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all hover:scale-105 ${
                      isInWatchlist
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isInWatchlist ? 'fill-white' : ''}`} />
                    <span className="font-medium">لیست تماشا</span>
                  </button>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all hover:scale-105 ${
                      isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                    <span className="font-medium">علاقه‌مندی</span>
                  </button>
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-2xl transition-all hover:scale-105"
                  >
                    <Star className="w-5 h-5" />
                    <span className="font-medium">امتیاز دهید</span>
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-2xl transition-all hover:scale-105">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">اشتراک‌گذاری</span>
                  </button>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                  <h3 className="font-bold mb-4">جوایز</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-xl">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="text-sm">اسکار بهترین جلوه‌های ویژه</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-xl">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="text-sm">بفتا بهترین فیلمبرداری</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-8">عوامل</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {['کریستوفر نولان', 'متیو مک‌کانهی', 'آن هاثاوی', 'جسیکا چستین', 'مایکل کین', 'مت دیمون'].map((name, idx) => (
                  <Link key={idx} to={`/actor/${idx + 1}`} className="p-4 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all cursor-pointer">
                    <div className="w-full aspect-square bg-muted rounded-xl mb-3" />
                    <div className="font-medium text-sm text-center">{name}</div>
                    <div className="text-xs text-muted-foreground text-center">{idx === 0 ? 'کارگردان' : 'بازیگر'}</div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">نقدها</h2>
                <Link to="/reviews" className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-colors">
                  نوشتن نقد
                </Link>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <span className="text-white font-bold">ع</span>
                        </div>
                        <div>
                          <Link to={`/user/${i}`} className="font-bold hover:text-primary">علی احمدی</Link>
                          <div className="text-sm text-muted-foreground">۲ روز پیش</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-accent text-accent" />
                        <span className="font-bold text-accent">9.0</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      شاهکار کریستوفر نولان. ترکیبی بی‌نظیر از علم، احساسات انسانی و بصری خیره‌کننده. موسیقی هانس زیمر هم فوق‌العاده است.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>۱۲۴ مفید</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>۱۸ دیدگاه</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors">
                        <Flag className="w-4 h-4" />
                        <span>گزارش</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16 mb-16">
              <h2 className="text-3xl font-bold mb-8">فیلم‌های مشابه</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <Link key={idx} to={`/movie/${idx}`}>
                    <MovieCard
                      title="گادفادر"
                      titleEn="The Godfather"
                      year={1972}
                      rating={9.2}
                      poster={`/assets/movies/${['cinema', 'film', 'night-city', 'tech', 'abstract'][idx - 1] || 'cinema'}.jpg`}
                      genre="جنایی"
                    />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {showRatingModal && (
        <RatingModal
          onClose={() => setShowRatingModal(false)}
          onRate={(rating) => {
            setUserRating(rating);
            setShowRatingModal(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

function RatingModal({ onClose, onRate }: { onClose: () => void; onRate: (rating: number) => void }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-3xl p-8 max-w-md w-full mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold mb-6 text-center">امتیاز شما</h3>
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-accent text-accent'
                    : 'text-muted'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="text-center text-4xl font-bold text-accent mb-6">
          {rating > 0 ? rating : '-'} / 10
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={() => onRate(rating)}
            disabled={rating === 0}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ثبت امتیاز
          </button>
        </div>
      </div>
    </div>
  );
}
