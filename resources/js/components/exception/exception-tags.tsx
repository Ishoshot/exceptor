import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Exception } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

interface ExceptionTagsProps {
    exception: Exception;
}

export default function ExceptionTags({ exception }: ExceptionTagsProps) {
    const [newTag, setNewTag] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddTag = () => {
        if (newTag.trim()) {
            router.post(
                route('exceptions.tags.add', { exception: exception.id }),
                {
                    name: newTag.trim(),
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setNewTag('');
                        setIsAdding(false);
                    },
                },
            );
        }
    };

    const handleRemoveTag = (tagId: string) => {
        router.delete(route('exceptions.tags.remove', { exception: exception.id }), {
            data: { tag_id: tagId },
            preserveScroll: true,
        });
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                {exception.tags.map((tag) => (
                    <Badge key={tag.id} className="flex items-center gap-1 px-3 py-1" style={{ backgroundColor: tag.color, color: '#fff' }}>
                        {tag.name}
                        <button
                            onClick={() => handleRemoveTag(tag.id)}
                            className="ml-1 rounded-full p-0.5 hover:bg-black/20"
                            aria-label={`Remove ${tag.name} tag`}
                        >
                            <FaTimes className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}

                {isAdding ? (
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Enter tag name"
                            className="h-8 w-40"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddTag();
                                } else if (e.key === 'Escape') {
                                    setIsAdding(false);
                                    setNewTag('');
                                }
                            }}
                            autoFocus
                        />
                        <Button variant="outline" size="sm" onClick={handleAddTag} disabled={!newTag.trim()}>
                            Add
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsAdding(false);
                                setNewTag('');
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setIsAdding(true)}>
                        <FaPlus className="h-3 w-3" /> Add Tag
                    </Button>
                )}
            </div>
        </div>
    );
}
