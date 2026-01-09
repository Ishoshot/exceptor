import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Feature } from '@/data/landing-page-data';
import { cn } from '@/lib/utils';
import { Activity, BarChart, Bell, Brain, LucideIcon, Plug, Users } from 'lucide-react';

interface FeatureCardProps {
    feature: Feature;
    className?: string;
}

// Map of icon names to their components
const iconMap: Record<string, LucideIcon> = {
    activity: Activity,
    brain: Brain,
    plug: Plug,
    users: Users,
    bell: Bell,
    'bar-chart': BarChart,
};

export function FeatureCard({ feature, className }: FeatureCardProps) {
    // Get the icon component from our map
    const IconComponent = iconMap[feature.icon];

    return (
        <Card className={cn('border-border/50 bg-card/50 h-full border backdrop-blur-sm transition-all duration-300 hover:shadow-md', className)}>
            <CardHeader>
                <div className="bg-primary/10 dark:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    {IconComponent && <IconComponent className="text-primary dark:text-primary-foreground h-6 w-6" />}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
        </Card>
    );
}
