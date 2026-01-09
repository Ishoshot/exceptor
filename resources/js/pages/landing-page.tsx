import { Footer } from '@/components/landing/common/footer';
import { Navigation } from '@/components/landing/common/navigation';
import { CTASection } from '@/components/landing/cta/cta-section';
import { FAQSection } from '@/components/landing/faq/faq-section';
import { FeaturesSection } from '@/components/landing/features/features-section';
import { FeaturesStorytellingSection } from '@/components/landing/features/features-storytelling-section';
import { HeroSection } from '@/components/landing/hero/hero-section';
import { PricingSection } from '@/components/landing/pricing/pricing-section';
import { TestimonialsSection } from '@/components/landing/testimonials/testimonials-section';
import { useEffect } from 'react';

export default function LandingPage() {
    // Smooth scroll to anchor links
    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (
                anchor &&
                anchor.hash &&
                anchor.hash.startsWith('#') &&
                anchor.origin + anchor.pathname === window.location.origin + window.location.pathname
            ) {
                e.preventDefault();

                const targetId = anchor.hash.slice(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for fixed header
                        behavior: 'smooth',
                    });

                    // Update URL without scrolling
                    window.history.pushState(null, '', anchor.hash);
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);

        return () => {
            document.removeEventListener('click', handleAnchorClick);
        };
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Navigation />

            <main className="flex-1">
                <HeroSection />
                <FeaturesStorytellingSection />
                <FeaturesSection />
                <TestimonialsSection />
                <PricingSection />
                <FAQSection />
                <CTASection />
            </main>

            <Footer />
        </div>
    );
}
