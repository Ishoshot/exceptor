import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToastNotifications } from '@/components/ui/toast-provider';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import { Application, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ClipboardCopy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaBell, FaCog, FaKey, FaShieldAlt, FaTrash } from 'react-icons/fa';

interface SettingsTabProps {
    application: Application;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ application: initialApplication }) => {
    const page = usePage<SharedData>();
    const [application, setApplication] = useState<Application>(initialApplication);
    const [activeSection, setActiveSection] = useState('general');
    const [webhookUrl, setWebhookUrl] = useState<string | null>(initialApplication.webhook_url || null);
    const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
    const toast = useToastNotifications();

    // Use the flash messages hook to automatically handle flash messages
    useFlashMessages();

    // Update application data when it changes in the page props
    useEffect(() => {
        if (page.props.application && typeof page.props.application === 'object') {
            const appData = page.props.application as Application;
            if (appData.id === initialApplication.id) {
                setApplication(appData);
                if (appData.webhook_url !== undefined) {
                    setWebhookUrl(appData.webhook_url);
                }
            }
        }
    }, [page.props.application, initialApplication.id]);

    // Form for webhook URL generation and regeneration
    const { post: generatePost, processing: generateProcessing } = useForm({});

    // Form for rate limit updates
    const {
        data: rateLimitData,
        setData: setRateLimitData,
        post: rateLimitPost,
        processing: rateLimitProcessing,
    } = useForm({
        rate_limit: application.rate_limit || 1000,
    });

    // Function to generate a new webhook URL
    const generateWebhookUrl = () => {
        generatePost(route('applications.webhook.generate', application.id), {
            onSuccess: (page) => {
                // Update the webhook URL from the response if available
                if (page.props.application && typeof page.props.application === 'object') {
                    const responseData = page.props.application as Application;
                    if (responseData.webhook_url) {
                        setWebhookUrl(responseData.webhook_url);
                    }
                }
            },
        });
    };

    // Function to regenerate the webhook URL after confirmation
    const regenerateWebhookUrl = () => {
        generatePost(route('applications.webhook.regenerate', application.id), {
            onSuccess: (page) => {
                setIsRegenerateDialogOpen(false);
                // Update the webhook URL from the response if available
                if (page.props.application && typeof page.props.application === 'object') {
                    const responseData = page.props.application as Application;
                    if (responseData.webhook_url) {
                        setWebhookUrl(responseData.webhook_url);
                    }
                }
            },
        });
    };

    // Function to update the rate limit
    const updateRateLimit = (e: React.FormEvent) => {
        e.preventDefault();
        rateLimitPost(route('applications.webhook.rate-limit', application.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                // Update the rate limit from the response if available
                if (page.props.application && typeof page.props.application === 'object') {
                    const responseData = page.props.application as Application;
                    if (responseData.rate_limit) {
                        setRateLimitData({ rate_limit: responseData.rate_limit });
                    }
                }
            },
        });
    };

    // Function to copy webhook URL to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Webhook URL Copied', 'The webhook URL has been copied to your clipboard.');
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">General Settings</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="app-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Application Name
                                </label>
                                <input
                                    type="text"
                                    id="app-name"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    defaultValue={application.name}
                                />
                            </div>

                            <div>
                                <label htmlFor="app-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Application URL
                                </label>
                                <input
                                    type="text"
                                    id="app-url"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    defaultValue={application.url}
                                />
                            </div>

                            <div>
                                <label htmlFor="app-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    id="app-description"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    defaultValue={application.description}
                                />
                            </div>

                            <div>
                                <label htmlFor="app-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Application Type
                                </label>
                                <select
                                    id="app-type"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option>Web Application</option>
                                    <option>Mobile Application</option>
                                    <option>Desktop Application</option>
                                    <option>API Service</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h3>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="email-notifications"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                        defaultChecked
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                                        Email Notifications
                                    </label>
                                    <p className="text-gray-500 dark:text-gray-400">Get notified when new errors occur</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="slack-notifications"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="slack-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                                        Slack Notifications
                                    </label>
                                    <p className="text-gray-500 dark:text-gray-400">Send notifications to a Slack channel</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="webhook-notifications"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="webhook-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                                        Webhook Notifications
                                    </label>
                                    <p className="text-gray-500 dark:text-gray-400">Send notifications to a custom webhook</p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Webhook URL
                                </label>
                                <input
                                    type="text"
                                    id="webhook-url"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="https://example.com/webhook"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'api':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Configurations</h3>

                        <div className="space-y-6">
                            {/* Webhook URL Section */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Webhook URL</h4>
                                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                        This webhook URL is used to send exception data from your applications to Exceptor.
                                    </p>

                                    {webhookUrl ? (
                                        <div className="space-y-3">
                                            <div className="flex">
                                                <Input value={webhookUrl} readOnly disabled className="flex-1 rounded-r-none" />
                                                <Button
                                                    variant="outline"
                                                    className="rounded-l-none border-l-0"
                                                    onClick={() => copyToClipboard(webhookUrl)}
                                                >
                                                    <ClipboardCopy className="mr-2 h-4 w-4" />
                                                    Copy
                                                </Button>
                                            </div>

                                            <AlertDialog open={isRegenerateDialogOpen} onOpenChange={setIsRegenerateDialogOpen}>
                                                <Button variant="outline" onClick={() => setIsRegenerateDialogOpen(true)}>
                                                    Regenerate Webhook URL
                                                </Button>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Regenerating your webhook URL will invalidate the current URL. Any applications using the
                                                            current webhook URL will stop sending data to Exceptor until you update them with the new
                                                            URL.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={regenerateWebhookUrl}>Yes, regenerate</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    ) : (
                                        <Button onClick={generateWebhookUrl}>Generate Webhook URL</Button>
                                    )}
                                </div>
                            </div>

                            {/* Rate Limit Section */}
                            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Rate Limits</h4>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    Set the maximum number of requests your application can make to the webhook URL per minute.
                                </p>
                                <div className="flex items-center">
                                    <Input
                                        type="number"
                                        className="w-24"
                                        value={rateLimitData.rate_limit}
                                        onChange={(e) => setRateLimitData({ rate_limit: parseInt(e.target.value) })}
                                        min={1}
                                    />
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">requests per minute</span>
                                </div>
                                <div className="mt-2">
                                    <Button variant="default" onClick={updateRateLimit} disabled={rateLimitProcessing}>
                                        {rateLimitProcessing ? 'Updating...' : 'Update Rate Limit'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="ip-whitelist"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="ip-whitelist" className="font-medium text-gray-700 dark:text-gray-300">
                                        IP Whitelisting
                                    </label>
                                    <p className="text-gray-500 dark:text-gray-400">Restrict access to specific IP addresses</p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="ip-addresses" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Allowed IP Addresses
                                </label>
                                <textarea
                                    id="ip-addresses"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter IP addresses, one per line"
                                />
                            </div>

                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="two-factor"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="two-factor" className="font-medium text-gray-700 dark:text-gray-300">
                                        Two-Factor Authentication
                                    </label>
                                    <p className="text-gray-500 dark:text-gray-400">Require 2FA for all team members</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'danger':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Danger Zone</h3>

                        <div className="space-y-4">
                            <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
                                <h4 className="text-sm font-medium text-red-800 dark:text-red-400">Delete Application</h4>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                    Once you delete an application, there is no going back. Please be certain.
                                </p>
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm leading-4 font-medium text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                                    >
                                        <FaTrash className="mr-2 -ml-0.5 h-4 w-4" /> Delete Application
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-md border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-900/20">
                                <h4 className="text-sm font-medium text-orange-800 dark:text-orange-400">Clear All Data</h4>
                                <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                                    This will remove all errors, logs, and performance data but keep the application.
                                </p>
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-orange-100 px-3 py-2 text-sm leading-4 font-medium text-orange-700 hover:bg-orange-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none dark:bg-orange-900 dark:text-orange-100 dark:hover:bg-orange-800"
                                    >
                                        Clear All Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="w-full shrink-0 md:w-64">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Settings</h2>

                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveSection('general')}
                                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                                        activeSection === 'general'
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <FaCog
                                        className={`mr-3 h-5 w-5 ${
                                            activeSection === 'general' ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    />
                                    General
                                </button>

                                <button
                                    onClick={() => setActiveSection('notifications')}
                                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                                        activeSection === 'notifications'
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <FaBell
                                        className={`mr-3 h-5 w-5 ${
                                            activeSection === 'notifications' ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    />
                                    Notifications
                                </button>

                                <button
                                    onClick={() => setActiveSection('api')}
                                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                                        activeSection === 'api'
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <FaKey
                                        className={`mr-3 h-5 w-5 ${activeSection === 'api' ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}
                                    />
                                    Configurations
                                </button>

                                <button
                                    onClick={() => setActiveSection('security')}
                                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                                        activeSection === 'security'
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <FaShieldAlt
                                        className={`mr-3 h-5 w-5 ${
                                            activeSection === 'security' ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    />
                                    Security
                                </button>

                                <button
                                    onClick={() => setActiveSection('danger')}
                                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                                        activeSection === 'danger'
                                            ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <FaTrash
                                        className={`mr-3 h-5 w-5 ${activeSection === 'danger' ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}
                                    />
                                    Danger Zone
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">{renderContent()}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
