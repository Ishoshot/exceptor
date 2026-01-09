import { PricingCard } from '@/components/landing/pricing/pricing-card';
import { Button } from '@/components/ui/button';
import { pricingData } from '@/data/landing-page-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function PricingSection() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <section id="pricing" className="relative py-20">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="bg-primary/5 absolute top-1/2 -right-[10%] h-[60%] w-[60%] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 container">
                <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, Transparent Pricing</h2>
                    <p className="text-muted-foreground text-xl">Choose the plan that's right for your project</p>

                    <div className="mt-8 flex items-center justify-center">
                        <div className="bg-muted/50 inline-flex items-center rounded-lg p-1">
                            <Button
                                variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setBillingPeriod('monthly')}
                                className={cn('rounded-md transition-all', billingPeriod === 'monthly' ? 'shadow-sm' : '')}
                            >
                                Monthly
                            </Button>
                            <Button
                                variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setBillingPeriod('yearly')}
                                className={cn('rounded-md transition-all', billingPeriod === 'yearly' ? 'shadow-sm' : '')}
                            >
                                Yearly
                                <span className="bg-primary/20 ml-1.5 rounded-full px-2 py-0.5 text-xs font-medium">Save 20%</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {pricingData.map((tier, index) => (
                        <div
                            key={tier.id}
                            className={cn('opacity-0', {
                                'animate-fade-in [animation-delay:200ms]': index === 0,
                                'animate-fade-in [animation-delay:400ms]': index === 1,
                                'animate-fade-in [animation-delay:600ms]': index === 2,
                            })}
                        >
                            <PricingCard tier={tier} billingPeriod={billingPeriod} isPopular={tier.highlighted} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
