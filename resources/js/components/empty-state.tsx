type EmptyStateProps = {
    message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
    return (
        <div className="flex h-full w-full items-center justify-center p-4">
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>
    );
}
