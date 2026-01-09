import { Button } from '@/components/ui/button';
import { statsData } from '@/data/landing-page-data';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
    return (
        <section className="relative py-20">
            {/* Background decoration */}
            <div className="bg-primary/5 dark:bg-primary/10 absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.1)_0%,transparent_60%)]" />
            </div>

            <div className="relative z-10 container">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Start monitoring your application exceptions today</h2>
                                <p className="text-muted-foreground text-xl">
                                    Join thousands of developers who trust Exceptor to track, analyze, and resolve application errors.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link href={route('register')}>
                                    <Button size="lg" className="group">
                                        Get Started for Free
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link href="#demo">
                                    <Button size="lg" variant="outline">
                                        Schedule a Demo
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {statsData.map((stat, index) => (
                                <div key={index} className="bg-card/50 border-border/50 rounded-lg border p-6 text-center backdrop-blur-sm">
                                    <div className="text-primary mb-2 text-3xl font-bold">{stat.value}</div>
                                    <div className="text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
