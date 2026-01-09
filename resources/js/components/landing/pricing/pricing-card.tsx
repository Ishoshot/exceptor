import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingTier } from '@/data/landing-page-data';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';

interface PricingCardProps {
    tier: PricingTier;
    billingPeriod: 'monthly' | 'yearly';
    isPopular?: boolean;
    className?: string;
}

export function PricingCard({ tier, billingPeriod, isPopular, className }: PricingCardProps) {
    // Calculate yearly price (20% discount)
    const price = billingPeriod === 'yearly' ? `$${Math.floor(parseInt(tier.price.replace('$', '')) * 0.8 * 12)}` : tier.price;

    // Update billing period text
    const periodText = billingPeriod === 'yearly' ? 'per year' : tier.billingPeriod;

    return (
        <Card
            className={cn(
                'border transition-all duration-300',
                isPopular ? 'border-primary relative z-10 scale-105 shadow-md' : 'border-border/50 hover:border-border hover:shadow-sm',
                className,
            )}
        >
            {isPopular && (
                <div className="bg-primary text-primary-foreground absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-medium">
                    Most Popular
                </div>
            )}

            <CardHeader>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{price}</span>
                    <span className="text-muted-foreground ml-2">{periodText}</span>
                </div>

                <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <Check className="text-primary mr-2 h-5 w-5 shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                <Link href={tier.ctaLink} className="w-full">
                    <Button variant={isPopular ? 'default' : 'outline'} className="w-full">
                        {tier.cta}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
