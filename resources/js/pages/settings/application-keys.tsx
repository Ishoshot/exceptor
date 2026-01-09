import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Confirm } from '@/components/ui/confirm';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToastNotifications } from '@/components/ui/toast-provider';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import { ApplicationKey, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ClipboardIcon, EditIcon, KeyIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'API Keys',
        href: '/settings/application-keys',
    },
];

export default function ApplicationKeys({ applicationKeys }: { applicationKeys: ApplicationKey[] }) {
    const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
    const [editKeyDialogOpen, setEditKeyDialogOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<ApplicationKey | null>(null);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const toast = useToastNotifications();

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        expires_at: null as string | null,
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm<{
        name: string;
        expires_at: string | null;
        is_enabled: boolean;
    }>({
        name: '',
        expires_at: null,
        is_enabled: true,
    });

    // Use the flash messages hook to automatically handle flash messages
    useFlashMessages();

    const handleCreateKey = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('application-keys.store'), {
            onSuccess: () => {
                reset();
                setDate(undefined);
                setNewKeyDialogOpen(false);
            },
        });
    };

    const handleEditKey = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedKey) return;

        put(route('application-keys.update', { applicationKey: selectedKey.id }), {
            onSuccess: () => {
                resetEdit();
                setEditKeyDialogOpen(false);
                setSelectedKey(null);
            },
        });
    };

    const handleDeleteKey = (id: string) => {
        destroy(route('application-keys.destroy', { applicationKey: id }), {
            onSuccess: () => {},
            onError: () => {},
        });
    };

    const copyKeyId = (key: string) => {
        navigator.clipboard.writeText(key);
        toast.success('API Key Copied', 'The API key has been copied to your clipboard.');
    };

    const selectKeyForEdit = (key: ApplicationKey) => {
        setSelectedKey(key);
        setEditData({
            name: key.name,
            expires_at: key.expires_at,
            is_enabled: key.is_enabled,
        });
        setEditKeyDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Application Keys" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-end justify-between">
                        <HeadingSmall title="API Keys" description="You can create up to 5 API keys to authenticate your applications." />

                        <Dialog open={newKeyDialogOpen} onOpenChange={setNewKeyDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="cursor-pointer" disabled={applicationKeys.length >= 5}>
                                    <KeyIcon className="mr-2 h-4 w-4" />
                                    Create New Key
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create API Key</DialogTitle>
                                    <DialogDescription>Create a new API key to authenticate your application with Exceptor.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateKey} className="mt-4 space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Key Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            autoComplete="off"
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="My Application"
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, 'PPP') : 'Select a date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={(selectedDate) => {
                                                        setDate(selectedDate);
                                                        setData('expires_at', selectedDate ? selectedDate.toISOString() : null);
                                                    }}
                                                    initialFocus
                                                    disabled={(date) => date < new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.expires_at && <p className="text-sm text-red-500">{errors.expires_at}</p>}
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                reset();
                                                setDate(undefined);
                                                setNewKeyDialogOpen(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            Create Key
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Separator />

                    {applicationKeys.length === 0 ? (
                        <div className="py-8 text-center">
                            <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No API keys</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You haven't created any API keys yet.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border border-gray-200 dark:border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                            >
                                                Created
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                            >
                                                Expires
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                            >
                                                Last Used
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                        {applicationKeys.map((key) => (
                                            <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                    {key.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {format(new Date(key.created_at), "PPP 'at' p")}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {key.expires_at ? format(new Date(key.expires_at), 'PPP') : 'Never'}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {key.last_used_at ? format(new Date(key.last_used_at), "PPP 'at' p") : 'Never used'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {key.is_enabled ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                        >
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                        >
                                                            Disabled
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => copyKeyId(key.key)}
                                                            title="Copy API Key ID"
                                                        >
                                                            <ClipboardIcon className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => selectKeyForEdit(key)}>
                                                            <EditIcon className="h-4 w-4" />
                                                        </Button>
                                                        <Confirm
                                                            title="Delete API Key"
                                                            description="Are you sure you want to delete this API key? This action cannot be undone."
                                                            confirmText="Delete"
                                                            variant="destructive"
                                                            size="sm"
                                                            onConfirm={() => handleDeleteKey(key.id)}
                                                        >
                                                            <Button variant="destructive" size="sm">
                                                                <TrashIcon className="h-4 w-4" />
                                                            </Button>
                                                        </Confirm>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <Dialog open={editKeyDialogOpen} onOpenChange={setEditKeyDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit API Key</DialogTitle>
                                <DialogDescription>Update your API key settings.</DialogDescription>
                            </DialogHeader>
                            {selectedKey && (
                                <form onSubmit={handleEditKey} className="mt-4 space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-name">Key Name</Label>
                                        <Input id="edit-name" value={editData.name} onChange={(e) => setEditData('name', e.target.value)} required />
                                        {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-expires_at">Expiration Date (Optional)</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !editData.expires_at && 'text-muted-foreground',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {editData.expires_at ? format(new Date(editData.expires_at), 'PPP') : 'Select a date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={editData.expires_at ? new Date(editData.expires_at) : undefined}
                                                    onSelect={(selectedDate) => {
                                                        setEditData('expires_at', selectedDate ? selectedDate.toISOString() : null);
                                                    }}
                                                    initialFocus
                                                    disabled={(date) => date < new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {editErrors.expires_at && <p className="text-sm text-red-500">{editErrors.expires_at}</p>}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="edit-is_enabled">Status</Label>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Enable or disable this API key</p>
                                        </div>
                                        <Switch
                                            id="edit-is_enabled"
                                            checked={editData.is_enabled}
                                            onCheckedChange={(checked) => setEditData('is_enabled', checked)}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                resetEdit();
                                                setEditKeyDialogOpen(false);
                                                setSelectedKey(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={editProcessing}>
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
