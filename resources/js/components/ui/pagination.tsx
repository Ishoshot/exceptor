import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FaRightLong, FaLeftLong } from 'react-icons/fa6';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            // If we have fewer pages than our max, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first and last page
            pages.push(1);
            
            // Calculate range around current page
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust if we're near the start or end
            if (currentPage <= 2) {
                endPage = 3;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 2;
            }
            
            // Add ellipsis before range if needed
            if (startPage > 2) {
                pages.push(-1); // -1 represents ellipsis
            }
            
            // Add the range of pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            // Add ellipsis after range if needed
            if (endPage < totalPages - 1) {
                pages.push(-2); // -2 represents ellipsis
            }
            
            // Add last page if not already included
            if (endPage < totalPages) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <nav className={cn('flex items-center justify-center space-x-2', className)}>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
            >
                <FaLeftLong className="h-4 w-4" />
            </Button>
            
            {pages.map((page, index) => {
                if (page < 0) {
                    // Render ellipsis
                    return (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                            ...
                        </span>
                    );
                }
                
                return (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => onPageChange(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </Button>
                );
            })}
            
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
            >
                <FaRightLong className="h-4 w-4" />
            </Button>
        </nav>
    );
}
