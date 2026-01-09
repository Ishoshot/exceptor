import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExceptionLevel } from '@/types';

interface ExceptionLevelBadgeProps {
    level: ExceptionLevel;
    className?: string;
}

export default function ExceptionLevelBadge({ level, className }: ExceptionLevelBadgeProps) {
    // Helper function to get level color
    const getLevelColor = (level: ExceptionLevel) => {
        switch (level) {
            case 'debug':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            case 'info':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'notice':
                return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'critical':
            case 'alert':
            case 'emergency':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return <Badge className={cn(getLevelColor(level), className)}>{level}</Badge>;
}
