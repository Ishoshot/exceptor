import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    profile_photo_url?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Application {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    description: string;
    url: string;
    repository: string;
    webhook_url?: string | null;
    rate_limit?: number;
    type: ApplicationType;
    created_at: string;
    updated_at: string;
}

export interface ApplicationType {
    id: string;
    name: string;
    slug: string;
    color?: string;
}

export interface ApplicationKey {
    id: string;
    name: string;
    key: string;
    application_id: string;
    expires_at: string | null;
    last_used_at: string | null;
    is_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

// Inertia Page type for proper typing of page responses
export interface Page<T = Record<string, unknown>> {
    component: string;
    props: {
        applications?: PaginatedData<Application>;
        exceptions?: PaginatedData<Exception>;
        [key: string]: unknown;
    };
    url: string;
    version: string | null;
    scrollRegions: Array<{ top: number; left: number }>;
    rememberedState: Record<string, unknown>;
}

// Exception Management Types
export type ExceptionStatus = 'unresolved' | 'resolved' | 'muted' | 'ignored';
export type ExceptionLevel = 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert' | 'emergency';
export type ExceptionEnvironment = 'production' | 'staging' | 'development' | 'testing' | 'local' | 'unknown';
export type ExceptionSource = 'backend' | 'frontend' | 'database' | 'third_party' | 'api' | 'queue' | 'console' | 'other';

export interface Exception {
    id: string;
    application_id: string;
    application: Application;
    exception_class: string;
    message: string;
    file: string;
    line: number;
    code: number | null;
    fingerprint: string;
    status: ExceptionStatus;
    level: ExceptionLevel;
    environment: ExceptionEnvironment;
    source: ExceptionSource;
    first_seen_at: string;
    last_seen_at: string;
    occurrence_count: number;
    resolved_at: string | null;
    resolved_by_id: string | null;
    occurrences_count: number;
    comments_count: number;
    tags: ExceptionTag[];
    trace?: string;
    trace_formatted?: Array<{
        index?: number;
        file?: string;
        line?: number;
        function?: string;
        class?: string;
        type?: string;
        args?: any[];
        code_snippet?: Record<string, string>;
        code_start_line?: number;
        code_end_line?: number;
        code_highlight_line?: number;
    }>;
    request_data?: Record<string, unknown> | null;
    environment_data?: Record<string, unknown> | null;
    user_data?: Record<string, unknown> | null;
    breadcrumbs?: ExceptionBreadcrumbItem[];
    created_at: string;
    updated_at: string;
}

export interface ExceptionOccurrence {
    id: string;
    application_exception_id: string;
    request_data: Record<string, unknown> | null;
    user_data: Record<string, unknown> | null;
    environment_data: Record<string, unknown> | null;
    breadcrumbs: Array<Record<string, unknown>> | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface ExceptionTag {
    id: string;
    application_id: string;
    name: string;
    color: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface ExceptionComment {
    id: string;
    application_exception_id: string;
    user_id: string;
    user: User;
    content: string;
    is_internal: boolean;
    metadata: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

// Navigation breadcrumb
export interface BreadcrumbItem {
    title: string;
    href: string;
}

// Exception breadcrumb
export interface ExceptionBreadcrumbItem {
    id: string;
    type: string;
    timestamp: string;
    data: Record<string, any>;
    level?: 'info' | 'debug' | 'error' | 'warning';
    category?: string;
    message?: string;
}

// Occurrence breadcrumb
export interface Breadcrumb {
    type?: string;
    timestamp?: string;
    message?: string;
    category?: string;
    data?: Record<string, unknown>;
}

// Request data for exception occurrences
export interface RequestData {
    method?: string;
    url?: string;
    ip?: string;
    headers?: Record<string, unknown>;
    cookies?: Record<string, unknown>;
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
}

// Props for the SingleOccurrenceView component
export interface SingleOccurrenceViewProps {
    occurrence: ExceptionOccurrence;
    onBack: () => void;
    formatJsonData: (data: Record<string, unknown> | null | undefined) => string;
    safeString: (value: unknown) => string;
    safeRecord: (value: unknown) => Record<string, unknown> | null;
    hasProperty: <T extends Record<string, unknown>, K extends string>(obj: T | null | undefined, prop: K) => obj is T & Record<K, unknown>;
}

// Props for the ExceptionOccurrences component
export interface ExceptionOccurrencesProps {
    occurrences: ExceptionOccurrence[];
}

// Stack frame for exception stack traces
export interface StackFrame {
    index: number;
    file: string;
    line: number;
    function?: string;
    class?: string;
    type?: string;
    args?: any[];
    code_snippet?: Record<string, string>;
    code_start_line?: number;
    code_end_line?: number;
    code_highlight_line?: number;
}

// Props for the ExceptionStackTrace component
export interface ExceptionStackTraceProps {
    exception: Exception;
}

// Props for the ExceptionMetadata component
export interface ExceptionMetadataProps {
    exception: Exception;
}
