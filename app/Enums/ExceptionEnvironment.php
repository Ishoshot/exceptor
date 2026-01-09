<?php

declare(strict_types=1);

namespace App\Enums;

enum ExceptionEnvironment: string
{
    case Production = 'production';
    case Staging = 'staging';
    case Development = 'development';
    case Testing = 'testing';
    case Local = 'local';
    case Unknown = 'unknown';

    /**
     * Get all environments as an array.
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
     * Create from a string value, defaulting to Unknown if not valid.
     */
    public static function fromString(string $value): self
    {
        return self::tryFrom(mb_strtolower($value)) ?? self::Unknown;
    }

    /**
     * Get a human-readable label for the environment.
     */
    public function label(): string
    {
        return match ($this) {
            self::Production => 'Production',
            self::Staging => 'Staging',
            self::Development => 'Development',
            self::Testing => 'Testing',
            self::Local => 'Local',
            self::Unknown => 'Unknown',
        };
    }

    /**
     * Get the color associated with this environment.
     */
    public function color(): string
    {
        return match ($this) {
            self::Production => 'red',
            self::Staging => 'orange',
            self::Development => 'blue',
            self::Testing => 'purple',
            self::Local => 'green',
            self::Unknown => 'gray',
        };
    }

    /**
     * Determine if this is a production environment.
     */
    public function isProduction(): bool
    {
        return $this === self::Production;
    }

    /**
     * Get the priority of this environment.
     * Higher number means higher priority.
     */
    public function priority(): int
    {
        return match ($this) {
            self::Production => 5,
            self::Staging => 4,
            self::Development => 3,
            self::Testing => 2,
            self::Local => 1,
            self::Unknown => 0,
        };
    }
}
