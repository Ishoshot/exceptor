import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import { ApplicationType } from '@/types';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { FormEventHandler } from 'react';
import { CheckCircle2 } from 'lucide-react';
import ApplicationIcon from './application-icon';

interface Props {
    applicationTypes: ApplicationType[];
}

export default function CreateApplication({ applicationTypes }: Props) {
    useFlashMessages();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        application_type_id: '',
        description: '',
        url: '',
        repository: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('applications.store'), {
            onSuccess: () => {
                reset();
            },
            onError: () => {
            },
        });
    };

    return (
        <Dialog onOpenChange={(open) => !open && reset()}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm">
                    <PlusIcon className="h-4 w-4" />
                    Create Application
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={submit}>
                    <DialogTitle className="mb-4">Create New Application</DialogTitle>
                    <DialogDescription className="mb-6">
                        Fill in the details below to create a new application project.
                    </DialogDescription>

                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="name" className="mb-2 block font-medium">
                                Application Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                placeholder="e.g. My Application"
                                autoComplete="off"
                                className="mt-1 block w-full"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <Label className="mb-3 block font-medium">
                                Application Type <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-3 gap-4">
                                {applicationTypes.map((type) => (
                                    <button
                                        type="button"
                                        key={type.id}
                                        onClick={() => setData('application_type_id', type.id)}
                                        className={cn(
                                            'relative flex flex-col items-center justify-center space-y-2 rounded-lg border p-4 text-center transition-all duration-150 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                            data.application_type_id === type.id
                                                ? 'border-primary bg-muted text-muted-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                                                : 'border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                                        )}
                                    >
                                        {data.application_type_id === type.id && (
                                            <CheckCircle2 className="absolute right-2 top-2 h-5 w-5 text-primary" />
                                        )}
                                        <ApplicationIcon applicationSlug={type.slug} size={32} />
                                        <span className="text-sm font-medium">{type.name}</span>
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.application_type_id} className="mt-2" />
                        </div>
                        <div>
                            <Label htmlFor="description" className="mb-2 block font-medium">
                                Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                autoComplete="off"
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full min-h-[100px]"
                                placeholder="Briefly describe your application..."
                                required
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        <div>
                            <Label htmlFor="url" className="mb-2 block font-medium">
                                URL (Optional)
                            </Label>
                            <Input
                                id="url"
                                type="url"
                                name="url"
                                value={data.url}
                                autoComplete="off"
                                onChange={(e) => setData('url', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="https://example.com"
                            />
                            <InputError message={errors.url} className="mt-2" />
                        </div>
                        <div>
                            <Label htmlFor="repository" className="mb-2 block font-medium">
                                Repository (Optional)
                            </Label>
                            <Input
                                id="repository"
                                type="text"
                                name="repository"
                                value={data.repository}
                                autoComplete="off"
                                onChange={(e) => setData('repository', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="https://github.com/username/repository"
                            />
                            <InputError message={errors.repository} className="mt-2" />
                        </div>
                    </div>

                    <DialogFooter className="mt-8">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Application'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
