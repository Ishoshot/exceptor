import { TestimonialCard } from '@/components/landing/testimonials/testimonial-card';
import { Button } from '@/components/ui/button';
import { testimonialData } from '@/data/landing-page-data';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setVisibleCount(3);
            } else if (window.innerWidth >= 768) {
                setVisibleCount(2);
            } else {
                setVisibleCount(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveIndex((prev) => (prev + 1) % testimonialData.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveIndex((prev) => (prev - 1 + testimonialData.length) % testimonialData.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <section id="testimonials" className="relative py-20">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -bottom-[40%] -left-[10%] h-[60%] w-[60%] rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="relative z-10 container">
                <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What Our Users Say</h2>
                    <p className="text-muted-foreground text-xl">Join thousands of developers who trust Exceptor for their exception monitoring</p>
                </div>

                <div className="relative px-4 sm:px-8">
                    <div ref={containerRef} className="overflow-hidden">
                        <div
                            className={cn('flex transition-transform duration-500 ease-in-out', isAnimating ? 'pointer-events-none' : '')}
                            style={{
                                transform: `translateX(-${activeIndex * (100 / visibleCount)}%)`,
                                width: `${(testimonialData.length / visibleCount) * 100}%`,
                            }}
                        >
                            {testimonialData.map((testimonial) => (
                                <div key={testimonial.id} className="px-4" style={{ width: `${(100 / testimonialData.length) * visibleCount}%` }}>
                                    <TestimonialCard testimonial={testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrev}
                            disabled={isAnimating}
                            className="rounded-full"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex space-x-2">
                            {testimonialData.map((_, index) => (
                                <button
                                    key={index}
                                    className={cn(
                                        'h-2 w-2 rounded-full transition-all',
                                        index === activeIndex ? 'bg-primary w-6' : 'bg-muted hover:bg-muted-foreground/50',
                                    )}
                                    onClick={() => {
                                        if (isAnimating) return;
                                        setIsAnimating(true);
                                        setActiveIndex(index);
                                        setTimeout(() => setIsAnimating(false), 500);
                                    }}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                            disabled={isAnimating}
                            className="rounded-full"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
