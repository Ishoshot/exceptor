import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'white';
}

export function Logo({ className, size = 'md', variant = 'default' }: LogoProps) {
    const sizes = {
        sm: 'h-6',
        md: 'h-8',
        lg: 'h-10',
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="relative">
                <div
                    className={cn(
                        'flex items-center justify-center rounded-lg bg-gradient-to-br transition-all',
                        sizes[size],
                        variant === 'default' ? 'from-primary dark:from-primary to-purple-600 dark:to-purple-500' : 'from-white to-gray-200',
                    )}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(sizes[size], 'p-1')}>
                        <path d="M12 4L3 9L12 14L21 9L12 4Z" fill={variant === 'default' ? 'white' : 'black'} className="transition-colors" />
                        <path
                            d="M3 14L12 19L21 14"
                            stroke={variant === 'default' ? 'white' : 'black'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-colors"
                        />
                        <path
                            d="M7.5 11.5L7.5 16.5"
                            stroke={variant === 'default' ? 'white' : 'black'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="transition-colors"
                        />
                    </svg>
                </div>
                <div className="animate-pulse-subtle absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
            </div>
            <span
                className={cn(
                    'font-bold tracking-tight transition-colors',
                    {
                        'text-sm': size === 'sm',
                        'text-lg': size === 'md',
                        'text-xl': size === 'lg',
                    },
                    variant === 'default' ? 'text-primary dark:text-white' : 'text-white',
                )}
            >
                Exceptor
            </span>
        </div>
    );
}
