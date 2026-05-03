import { Navbar } from '../components/navbar-clean';
import { Footer } from '../components/footer';
import { Search } from 'lucide-react';
import { ActorCard } from '../components/actor-card';
import { Link } from 'react-router';
import { demoImages } from '../utils/image-placeholders';

export function ActorsPage() {
  const actors = [
    { name: 'لئوناردو دی کاپریو', nameEn: 'Leonardo DiCaprio', image: demoImages.actors[0], moviesCount: 45 },
    { name: 'مارگو رابی', nameEn: 'Margot Robbie', image: demoImages.actors[1], moviesCount: 32 },
    { name: 'تیموتی شالامه', nameEn: 'Timothée Chalamet', image: demoImages.actors[2], moviesCount: 28 },
    { name: 'زندایا', nameEn: 'Zendaya', image: demoImages.actors[3], moviesCount: 24 },
    { name: 'کیلیان مورفی', nameEn: 'Cillian Murphy', image: demoImages.actors[0], moviesCount: 38 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">بازیگران و هنرمندان</h1>
            <p className="text-xl text-muted-foreground">۱۵,۶۷۰ هنرمند</p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجوی بازیگر..."
                className="w-full pr-12 pl-6 py-4 bg-muted rounded-2xl outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, idx) => (
              <Link key={idx} to={`/actor/${idx + 1}`}>
                <ActorCard {...actors[idx % actors.length]} />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
