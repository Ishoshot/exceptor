import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastProps, ToastType } from './toast';

interface ToastContextProps {
    showToast: (props: Omit<ToastProps, 'onDismiss'>) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastItem extends Omit<ToastProps, 'onDismiss'> {
    id: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (props: Omit<ToastProps, 'onDismiss'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prevToasts) => [...prevToasts, { ...props, id }]);
        return id;
    };

    const hideToast = (id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onDismiss={() => hideToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Helper functions for common toast types
export function useToastNotifications() {
    const { showToast } = useToast();

    return {
        success: (title: string | undefined, message: string) => 
            showToast({ title, message, type: 'success' }),
        error: (title: string | undefined, message: string) => 
            showToast({ title, message, type: 'error' }),
        info: (title: string | undefined, message: string) => 
            showToast({ title, message, type: 'info' }),
        warning: (title: string | undefined, message: string) => 
            showToast({ title, message, type: 'warning' })
    };
}
