import { motion } from 'framer-motion';
import React from 'react';
import { FaCheckCircle, FaEyeSlash, FaTimes, FaTrash } from 'react-icons/fa';

interface ErrorBulkActionsProps {
    selectedCount: number;
    onResolve: () => void;
    onMute: () => void;
    onDelete: () => void;
    onClearSelection: () => void;
}

export const ErrorBulkActions: React.FC<ErrorBulkActionsProps> = ({ selectedCount, onResolve, onMute, onDelete, onClearSelection }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 transform items-center rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
            <div className="mr-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedCount} error{selectedCount !== 1 ? 's' : ''} selected
                </span>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={onResolve}
                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-1.5 text-sm leading-4 font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                >
                    <FaCheckCircle className="mr-1.5 h-4 w-4" />
                    Resolve
                </button>

                <button
                    onClick={onMute}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm leading-4 font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    <FaEyeSlash className="mr-1.5 h-4 w-4" />
                    Mute
                </button>

                <button
                    onClick={onDelete}
                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1.5 text-sm leading-4 font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                >
                    <FaTrash className="mr-1.5 h-4 w-4" />
                    Delete
                </button>
            </div>

            <button onClick={onClearSelection} className="ml-4 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FaTimes className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
        </motion.div>
    );
};
