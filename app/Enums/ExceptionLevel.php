<?php

declare(strict_types=1);

namespace App\Enums;

enum ExceptionLevel: string
{
    case Debug = 'debug';
    case Info = 'info';
    case Notice = 'notice';
    case Warning = 'warning';
    case Error = 'error';
    case Critical = 'critical';
    case Alert = 'alert';
    case Emergency = 'emergency';

    /**
     * Get all levels as an array.
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
     * Get a human-readable label for the level.
     */
    public function label(): string
    {
        return match ($this) {
            self::Debug => 'Debug',
            self::Info => 'Info',
            self::Notice => 'Notice',
            self::Warning => 'Warning',
            self::Error => 'Error',
            self::Critical => 'Critical',
            self::Alert => 'Alert',
            self::Emergency => 'Emergency',
        };
    }

    /**
     * Get the color associated with this level.
     */
    public function color(): string
    {
        return match ($this) {
            self::Debug => 'gray',
            self::Info => 'blue',
            self::Notice => 'blue',
            self::Warning => 'yellow',
            self::Error => 'orange',
            self::Critical => 'red',
            self::Alert => 'red',
            self::Emergency => 'purple',
        };
    }

    /**
     * Get the severity value for ordering.
     * Higher number means more severe.
     */
    public function severity(): int
    {
        return match ($this) {
            self::Debug => 1,
            self::Info => 2,
            self::Notice => 3,
            self::Warning => 4,
            self::Error => 5,
            self::Critical => 6,
            self::Alert => 7,
            self::Emergency => 8,
        };
    }

    /**
     * Check if this level is at least as severe as the given level.
     */
    public function isAtLeastAsSevereAs(self $level): bool
    {
        return $this->severity() >= $level->severity();
    }

    /**
     * Check if this level is more severe than the given level.
     */
    public function isMoreSevereThan(self $level): bool
    {
        return $this->severity() > $level->severity();
    }
}
