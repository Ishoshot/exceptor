import { useToastNotifications } from '@/components/ui/toast-provider';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * Hook to handle flash messages from the backend
 * Automatically displays toast notifications for success and error messages
 */
export function useFlashMessages() {
    const toast = useToastNotifications();
    const { flash } = usePage<SharedData>().props;

    // Keep track of which flash messages we've already shown
    const [shownMessages, setShownMessages] = useState<{
        success?: string;
        error?: string;
    }>({});

    // Display flash messages when they change
    useEffect(() => {
        // Only show messages if they're different from what we've already shown
        if (flash?.success && flash.success !== shownMessages.success) {
            toast.success(undefined, flash.success);
            setShownMessages((prev) => ({ ...prev, success: flash.success }));
        }

        if (flash?.error && flash.error !== shownMessages.error) {
            toast.error(undefined, flash.error);
            setShownMessages((prev) => ({ ...prev, error: flash.error }));
        }
    }, [flash, toast, shownMessages]);

    return {
        flash,
        hasFlash: !!(flash?.success || flash?.error),
        hasSuccessFlash: !!flash?.success,
        hasErrorFlash: !!flash?.error,
    };
}
