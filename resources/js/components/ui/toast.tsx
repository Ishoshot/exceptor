import React, { useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircleIcon, CheckCircleIcon, InfoIcon, XIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from './button';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
    title?: string;
    message: string;
    type: ToastType;
    onDismiss?: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

const toastVariants = cva(
    'flex w-full max-w-md flex-col gap-2 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
    {
        variants: {
            type: {
                success: 'bg-green-50 border-green-200 text-green-800',
                error: 'bg-red-50 border-red-200 text-red-800',
                info: 'bg-blue-50 border-blue-200 text-blue-800',
                warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            },
        },
        defaultVariants: {
            type: 'info',
        },
    }
);

const iconMap = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    error: <AlertCircleIcon className="h-5 w-5 text-red-500" />,
    info: <InfoIcon className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />,
};

export function Toast({
    className,
    title,
    message,
    type = 'info',
    onDismiss,
    autoClose = true,
    autoCloseDelay = 5000,
    ...props
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onDismiss) onDismiss();
        }, 300);
    };

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [autoClose, autoCloseDelay]);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                toastVariants({ type }),
                isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
                className
            )}
            role="alert"
            aria-live="assertive"
            {...props}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {iconMap[type]}
                    <div>
                        {title && (
                            <h3 className="font-semibold">{title}</h3>
                        )}
                        <p className="mt-1 text-sm">{message}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={handleDismiss}
                    aria-label="Close notification"
                >
                    <XIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
