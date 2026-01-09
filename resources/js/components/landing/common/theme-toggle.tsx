import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    // Only show the toggle after mounting to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-full transition-all duration-300 hover:scale-110"
            aria-label="Toggle theme"
        >
            {appearance === 'dark' ? (
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
            )}
        </Button>
    );
}
