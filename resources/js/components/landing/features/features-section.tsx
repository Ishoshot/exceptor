import { FeatureCard } from '@/components/landing/features/feature-card';
import { featuresData } from '@/data/landing-page-data';
import { cn } from '@/lib/utils';

export function FeaturesSection() {
    return (
        <section id="features" className="relative py-20">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="bg-primary/5 absolute top-1/2 left-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Powerful Features for Exception Monitoring</h2>
                    <p className="text-muted-foreground text-xl">Everything you need to track, analyze, and resolve application errors</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuresData.map((feature, index) => (
                        <div
                            key={feature.id}
                            className={cn('animate-fade-in', {
                                '[animation-delay:200ms]': index % 3 === 0,
                                '[animation-delay:400ms]': index % 3 === 1,
                                '[animation-delay:600ms]': index % 3 === 2,
                            })}
                        >
                            <FeatureCard feature={feature} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
