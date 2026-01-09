<?php

declare(strict_types=1);

namespace App\Enums;

enum ExceptionSource: string
{
    case Backend = 'backend';
    case Frontend = 'frontend';
    case Database = 'database';
    case ThirdParty = 'third_party';
    case Api = 'api';
    case Queue = 'queue';
    case Console = 'console';
    case Other = 'other';

    /**
     * Get all sources as an array.
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
     * Determine the source from an exception class and file path.
     */
    public static function determineFromException(string $exceptionClass, string $file): self
    {
        // Database related exceptions
        if (str_contains($exceptionClass, 'Database') ||
            str_contains($exceptionClass, 'PDO') ||
            str_contains($exceptionClass, 'SQL')) {
            return self::Database;
        }

        // API related exceptions
        if (str_contains($exceptionClass, 'Http') ||
            str_contains($exceptionClass, 'API') ||
            str_contains($exceptionClass, 'Guzzle')) {
            return self::Api;
        }

        // Queue related exceptions
        if (str_contains($exceptionClass, 'Queue') ||
            str_contains($file, '/queue/') ||
            str_contains($file, '/jobs/')) {
            return self::Queue;
        }

        // Console related exceptions
        if (str_contains($exceptionClass, 'Console') ||
            str_contains($file, '/console/') ||
            str_contains($file, '/commands/')) {
            return self::Console;
        }

        // Frontend related exceptions
        if (str_contains($file, '/resources/js/') ||
            str_contains($file, '/resources/ts/') ||
            str_contains($file, '/node_modules/')) {
            return self::Frontend;
        }

        // Third-party related exceptions
        if (str_contains($file, '/vendor/')) {
            return self::ThirdParty;
        }

        // Default to backend
        return self::Backend;
    }

    /**
     * Get a human-readable label for the source.
     */
    public function label(): string
    {
        return match ($this) {
            self::Backend => 'Backend',
            self::Frontend => 'Frontend',
            self::Database => 'Database',
            self::ThirdParty => 'Third Party',
            self::Api => 'API',
            self::Queue => 'Queue',
            self::Console => 'Console',
            self::Other => 'Other',
        };
    }

    /**
     * Get the icon associated with this source.
     */
    public function icon(): string
    {
        return match ($this) {
            self::Backend => 'server',
            self::Frontend => 'layout',
            self::Database => 'database',
            self::ThirdParty => 'external-link',
            self::Api => 'api',
            self::Queue => 'list',
            self::Console => 'terminal',
            self::Other => 'help-circle',
        };
    }
}
