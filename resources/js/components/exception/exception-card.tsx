import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Exception } from '@/types';
import { Link } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { FaCalendarAlt, FaClock, FaCommentAlt, FaTag } from 'react-icons/fa';

interface ExceptionCardProps {
    exception: Exception;
    className?: string;
}

export default function ExceptionCard({ exception, className }: ExceptionCardProps) {
    // Helper function to get status color
    const getStatusColor = (status: string) => {
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

    // Helper function to get level color
    const getLevelColor = (level: string) => {
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

    // Helper function to get environment color
    const getEnvironmentColor = (environment: string) => {
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

    // Format the exception class to be more readable
    const formatExceptionClass = (exceptionClass: string) => {
        // Remove namespace and just show the class name
        const parts = exceptionClass.split('\\');
        return parts[parts.length - 1];
    };

    return (
        <Card className={cn('overflow-hidden transition-all hover:shadow-md', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <div className="flex flex-col">
                    <Link
                        href={route('exceptions.show', { exception: exception.id })}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {exception.application.name}
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatExceptionClass(exception.exception_class)}</span>
                </div>
                <div className="flex space-x-2">
                    <Badge className={getLevelColor(exception.level)}>{exception.level}</Badge>
                    <Badge className={getStatusColor(exception.status)}>{exception.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Link
                    href={route('exceptions.show', { exception: exception.id })}
                    className="block font-medium hover:text-blue-600 dark:hover:text-blue-400"
                >
                    {exception.message.length > 100 ? `${exception.message.substring(0, 100)}...` : exception.message}
                </Link>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="block">
                        {exception.file.split('/').slice(-3).join('/')}:{exception.line}
                    </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className={getEnvironmentColor(exception.environment)}>{exception.environment}</Badge>
                    {exception.tags.slice(0, 3).map((tag) => (
                        <Badge
                            key={tag.id}
                            className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            style={{ backgroundColor: tag.color, color: '#fff' }}
                        >
                            {tag.name}
                        </Badge>
                    ))}
                    {exception.tags.length > 3 && (
                        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">+{exception.tags.length - 3} more</Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                    <Tooltip content={`First seen: ${format(new Date(exception.first_seen_at), 'PPP p')}`}>
                        <div className="flex items-center">
                            <FaCalendarAlt className="mr-1 h-4 w-4" />
                            <span>{formatDistanceToNow(new Date(exception.first_seen_at), { addSuffix: true })}</span>
                        </div>
                    </Tooltip>
                    <Tooltip content={`Last seen: ${format(new Date(exception.last_seen_at), 'PPP p')}`}>
                        <div className="flex items-center">
                            <FaClock className="mr-1 h-4 w-4" />
                            <span>{formatDistanceToNow(new Date(exception.last_seen_at), { addSuffix: true })}</span>
                        </div>
                    </Tooltip>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <FaCommentAlt className="mr-1 h-4 w-4" />
                        <span>{exception.comments_count}</span>
                    </div>
                    <div className="flex items-center">
                        <FaTag className="mr-1 h-4 w-4" />
                        <span>{exception.occurrence_count}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
