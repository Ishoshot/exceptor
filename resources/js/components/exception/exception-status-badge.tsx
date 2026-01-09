import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExceptionStatus } from '@/types';

interface ExceptionStatusBadgeProps {
    status: ExceptionStatus;
    className?: string;
}

export default function ExceptionStatusBadge({ status, className }: ExceptionStatusBadgeProps) {
    // Helper function to get status color
    const getStatusColor = (status: ExceptionStatus) => {
        switch (status) {
            case 'resolved':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'muted':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'ignored':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            case 'unresolved':
            default:
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };

    return <Badge className={cn(getStatusColor(status), className)}>{status}</Badge>;
}
