<?php

declare(strict_types=1);

namespace App\Enums;

enum ExceptionStatus: string
{
    case Unresolved = 'unresolved';
    case Resolved = 'resolved';
    case Muted = 'muted';
    case Ignored = 'ignored';

    /**
     * Get all statuses as an array.
     *
     * @return array<string, string>
     */
    public static function toArray(): array
    {
        return array_combine(
            array_column(self::cases(), 'name'),
            array_column(self::cases(), 'value')
        );
    }

    /**
     * Get all values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all names as an array.
     *
     * @return array<string>
     */
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    /**
     * Get a human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Unresolved => 'Unresolved',
            self::Resolved => 'Resolved',
            self::Muted => 'Muted',
            self::Ignored => 'Ignored',
        };
    }

    /**
     * Get the color associated with this status.
     */
    public function color(): string
    {
        return match ($this) {
            self::Unresolved => 'red',
            self::Resolved => 'green',
            self::Muted => 'yellow',
            self::Ignored => 'gray',
        };
    }
}
