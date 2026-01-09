import ApplicationIcon from '@/components/application/application-icon';
import { Button } from '@/components/ui/button';
import { heroData } from '@/data/landing-page-data';
import { Link } from '@inertiajs/react';
import { ArrowRight, Play } from 'lucide-react';

const languages = [
    { name: 'PHP', slug: 'php', category: 'Language' },
    { name: 'Laravel', slug: 'laravel', category: 'Backend' },
    { name: 'Node.js', slug: 'node-js', category: 'Backend' },
    { name: 'Python', slug: 'python', category: 'Language' },
    { name: 'Java', slug: 'java', category: 'Language' },
    { name: 'C#', slug: 'c-sharp', category: 'Language' },
    { name: 'Ruby', slug: 'ruby', category: 'Language' },
    { name: 'Go', slug: 'go', category: 'Language' },
    { name: 'Rust', slug: 'rust', category: 'Language' },
];

export function HeroSection() {
    return (
        <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-32 pb-20">
            {/* Background gradient */}
            <div className="from-background to-background/80 pointer-events-none absolute inset-0 bg-gradient-to-b" />

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="bg-primary/5 absolute -top-[40%] -left-[10%] h-[70%] w-[70%] rounded-full blur-3xl" />
                <div className="absolute -right-[10%] -bottom-[30%] h-[60%] w-[60%] rotate-12 rounded-full bg-purple-900/5 blur-3xl" />
            </div>

            {/* Content Layer - centered and non-selectable */}
            <div className="relative z-10 mx-auto mt-30 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center select-none">
                    <div className="animate-slide-down space-y-10">
                        <h1 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl lg:text-7xl">
                            {heroData.headline}
                        </h1>
                        <p className="text-muted-foreground mx-auto max-w-3xl text-xl md:text-2xl">{heroData.subheadline}</p>
                    </div>

                    <div className="animate-slide-up mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href={heroData.ctaPrimaryLink}>
                            <Button size="lg" className="group text-base">
                                {heroData.ctaPrimary}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href={heroData.ctaSecondaryLink}>
                            <Button size="lg" variant="outline" className="group text-base">
                                <Play className="mr-2 h-4 w-4" />
                                {heroData.ctaSecondary}
                            </Button>
                        </Link>
                    </div>

                    {/* Modern design for the 'Works with' section */}
                    <div className="animate-fade-in mt-16 w-full space-y-8">
                        {/* Popular Frameworks */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex items-center gap-8">
                                {languages.map(({ name, slug }) => (
                                    <div key={name} className="group flex flex-col items-center transition-all hover:scale-110">
                                        <div className="bg-background/50 border-border/20 rounded-xl border p-4 shadow-lg backdrop-blur-sm">
                                            <ApplicationIcon applicationSlug={slug} size={40} />
                                        </div>
                                        <span className="mt-2 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-muted-foreground text-sm">And many more languages and frameworks</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
