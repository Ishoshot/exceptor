import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExceptionEnvironment } from '@/types';

interface ExceptionEnvironmentBadgeProps {
    environment: ExceptionEnvironment;
    className?: string;
}

export default function ExceptionEnvironmentBadge({ environment, className }: ExceptionEnvironmentBadgeProps) {
    // Helper function to get environment color
    const getEnvironmentColor = (environment: ExceptionEnvironment) => {
        switch (environment) {
            case 'production':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'staging':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'development':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'testing':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'local':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return <Badge className={cn(getEnvironmentColor(environment), className)}>{environment}</Badge>;
}
