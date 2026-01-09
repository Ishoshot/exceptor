import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Testimonial } from '@/data/landing-page-data';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
    testimonial: Testimonial;
    className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
    // Get initials for avatar fallback
    const initials = testimonial.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <Card className={cn('border-border/50 bg-card/50 h-full border backdrop-blur-sm', 'transition-all duration-300 hover:shadow-md', className)}>
            <CardContent className="space-y-4 p-6">
                <div className="text-primary/20 dark:text-primary/30">
                    <Quote className="h-8 w-8" />
                </div>

                <p className="text-lg italic">"{testimonial.content}"</p>

                <div className="flex items-center pt-4">
                    <Avatar className="mr-4 h-10 w-10">
                        {testimonial.avatar ? <AvatarImage src={testimonial.avatar} alt={testimonial.name} /> : null}
                        <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>

                    <div>
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-muted-foreground text-sm">
                            {testimonial.role}, {testimonial.company}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
