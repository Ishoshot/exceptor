import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

interface NavigationProps {
    className?: string;
}

export function Navigation({ className }: NavigationProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
                isScrolled ? 'bg-background/80 py-7 shadow-sm backdrop-blur-md' : 'bg-transparent py-10',
                className,
            )}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Logo />

                {/* Desktop Navigation */}
                <nav className="hidden items-center space-x-8 md:flex">
                    <a href="#features" className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors">
                        Features
                    </a>
                    <a href="#testimonials" className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors">
                        Testimonials
                    </a>
                    <a href="#pricing" className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors">
                        Pricing
                    </a>
                    <a href="#faq" className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors">
                        FAQ
                    </a>
                </nav>

                <div className="hidden items-center space-x-4 md:flex">
                    <ThemeToggle />
                    <Link href={route('login')}>
                        <Button variant="ghost" size="sm">
                            Log in
                        </Button>
                    </Link>
                    <Link href={route('register')}>
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center space-x-4 md:hidden">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'bg-background/95 fixed inset-x-0 top-[57px] z-50 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out md:hidden',
                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
                )}
            >
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    <nav className="flex flex-col space-y-4">
                        <a
                            href="#features"
                            className="text-foreground/80 hover:text-foreground text-base font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Features
                        </a>
                        <a
                            href="#testimonials"
                            className="text-foreground/80 hover:text-foreground text-base font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Testimonials
                        </a>
                        <a
                            href="#pricing"
                            className="text-foreground/80 hover:text-foreground text-base font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Pricing
                        </a>
                        <a
                            href="#faq"
                            className="text-foreground/80 hover:text-foreground text-base font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            FAQ
                        </a>
                    </nav>

                    <div className="flex flex-col space-y-3">
                        <Link href={route('login')}>
                            <Button variant="outline" className="w-full justify-center">
                                Log in
                            </Button>
                        </Link>
                        <Link href={route('register')}>
                            <Button className="w-full justify-center">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
