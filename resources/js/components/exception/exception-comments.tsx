import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Exception, ExceptionComment } from '@/types';
import { router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { FaGlobeAmericas, FaLock, FaPaperPlane, FaTrash } from 'react-icons/fa';

interface ExceptionCommentsProps {
    exception: Exception;
    comments: ExceptionComment[];
}

export default function ExceptionComments({ exception, comments }: ExceptionCommentsProps) {
    const [content, setContent] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        router.post(
            route('exceptions.comments.store', { exception: exception.id }),
            {
                content: content.trim(),
                is_internal: isInternal,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setContent('');
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleDelete = (commentId: string) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(
                route('exceptions.comments.destroy', {
                    exception: exception.id,
                    comment: commentId,
                }),
                {
                    preserveScroll: true,
                },
            );
        }
    };

    // Get user initials for avatar fallback
    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="space-y-6">
            {/* Comment Form */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Discussion</h3>
                </div>
                <div className="p-4">
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Add your comment here..."
                            value={content}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                            className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="internal-comment"
                                        checked={isInternal}
                                        onCheckedChange={setIsInternal}
                                        className="data-[state=checked]:bg-amber-500"
                                    />
                                    <Label htmlFor="internal-comment" className="flex items-center gap-1.5 text-sm font-medium">
                                        {isInternal ? (
                                            <>
                                                <FaLock className="h-3 w-3 text-amber-500" />
                                                <span>Internal only</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaGlobeAmericas className="h-3 w-3 text-blue-500" />
                                                <span>Visible to all</span>
                                            </>
                                        )}
                                    </Label>
                                </div>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={!content.trim() || isSubmitting}
                                className={cn('gap-1.5', isInternal ? 'bg-amber-500 hover:bg-amber-600' : '')}
                            >
                                <FaPaperPlane className="h-3 w-3" />
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className={cn(
                                'overflow-hidden rounded-lg border bg-white dark:bg-gray-900',
                                comment.is_internal ? 'border-amber-200 dark:border-amber-900/50' : 'border-gray-200 dark:border-gray-800',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex items-center justify-between border-b px-4 py-2',
                                    comment.is_internal
                                        ? 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20'
                                        : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50',
                                )}
                            >
                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-7 w-7 border border-white shadow-sm dark:border-gray-800">
                                        <AvatarImage src={comment.user.profile_photo_url || ''} alt={comment.user.name} />
                                        <AvatarFallback className="text-xs">{getUserInitials(comment.user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {comment.is_internal && (
                                        <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                            <FaLock className="h-2.5 w-2.5" />
                                            <span>Internal</span>
                                        </div>
                                    )}
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(comment.id)}
                                        className="h-7 w-7 rounded-full p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                        aria-label="Delete comment"
                                    >
                                        <FaTrash className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">{comment.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                </div>
            )}
        </div>
    );
}
