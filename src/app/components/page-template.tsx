import { Navbar } from './navbar-clean';
import { Footer } from './footer';
import { ReactNode } from 'react';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageTemplate({ title, subtitle, children }: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">{title}</h1>
            {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
