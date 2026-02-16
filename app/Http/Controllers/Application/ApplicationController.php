<?php

declare(strict_types=1);

namespace App\Http\Controllers\Application;

use App\Http\Actions\Application\CreateApplicationAction;
use App\Http\Actions\Application\FetchApplicationsAction;
use App\Http\Actions\Application\FetchPaginatedApplicationsAction;
use App\Http\Requests\Application\FilterApplicationRequest;
use App\Http\Requests\Application\StoreApplicationRequest;
use App\Models\Application;
use App\Models\ApplicationType;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

final class ApplicationController
{
    /**
     * Display a listing of the resource.
     */
    public function index(
        FilterApplicationRequest $filterApplicationRequest,
        FetchApplicationsAction $fetchApplicationsAction
    ): \Inertia\Response {
        // Get application types for filter dropdown
        $applicationTypes = ApplicationType::latest()->get();

        // Fetch applications with filters
        $applications = $fetchApplicationsAction->handle($filterApplicationRequest->filters());

        return Inertia::render('application/applications', [
            'applications' => $applications,
            'applicationTypes' => $applicationTypes,
            'filters' => $filterApplicationRequest->filters(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreApplicationRequest $storeApplicationRequest,
        CreateApplicationAction $createApplicationAction
    ): \Illuminate\Http\RedirectResponse {
        $createApplicationAction->handle($storeApplicationRequest->all());

        return back()->with('success', 'Application created successfully.');
    }

    /**
     * Display all applications.
     */
    public function all(FilterApplicationRequest $filterApplicationRequest, FetchPaginatedApplicationsAction $fetchPaginatedApplicationsAction): \Inertia\Response
    {

        // Get authenticated user and ensure it's properly typed
        $user = Auth::user();

        if (! $user) {
            abort(403);
        }

        // Get application types for filter dropdown
        $applicationTypes = ApplicationType::latest()->get();
        $filters = $filterApplicationRequest->filters();

        // Fetch paginated applications with filters
        $lengthAwarePaginator = $fetchPaginatedApplicationsAction->handle($user, $filters, (int) $filters['perPage']);

        return Inertia::render('application/all-applications', [
            'applications' => $lengthAwarePaginator,
            'applicationTypes' => $applicationTypes,
            'filters' => $filters,
        ]);
    }

    /**
     * Display the specified application.
     */
    public function show(Application $application): \Inertia\Response
    {
        // Ensure the user owns this application
        if (Auth::id() !== $application->user_id) {
            abort(403);
        }

        // Load relationships
        $application->load(['type', 'user']);

        // Get some dummy data for the dashboard
        $errorStats = [
            'total' => random_int(50, 500),
            'resolved' => random_int(20, 200),
            'unresolved' => random_int(10, 100),
            'critical' => random_int(5, 30),
            'today' => random_int(0, 10),
            'yesterday' => random_int(5, 20),
            'this_week' => random_int(20, 50),
            'last_week' => random_int(30, 70),
            'by_environment' => [
                'production' => random_int(20, 200),
                'staging' => random_int(10, 100),
                'development' => random_int(5, 50),
                'testing' => random_int(1, 30),
            ],
            'by_browser' => [
                'Chrome' => random_int(20, 200),
                'Firefox' => random_int(10, 100),
                'Safari' => random_int(5, 50),
                'Edge' => random_int(1, 30),
            ],
            'by_os' => [
                'Windows' => random_int(20, 200),
                'macOS' => random_int(10, 100),
                'Linux' => random_int(5, 50),
                'iOS' => random_int(1, 30),
                'Android' => random_int(1, 30),
            ],
        ];

        $performanceData = [
            'response_time' => [
                'current' => random_int(50, 500),
                'previous' => random_int(50, 500),
                'change_percentage' => random_int(-20, 20),
                'trend' => array_map(fn (): int => random_int(50, 500), range(1, 24)),
            ],
            'throughput' => [
                'current' => random_int(1000, 10000),
                'previous' => random_int(1000, 10000),
                'change_percentage' => random_int(-20, 20),
                'trend' => array_map(fn (): int => random_int(1000, 10000), range(1, 24)),
            ],
            'error_rate' => [
                'current' => random_int(1, 10) / 100,
                'previous' => random_int(1, 10) / 100,
                'change_percentage' => random_int(-20, 20),
                'trend' => array_map(fn (): int|float => random_int(1, 10) / 100, range(1, 24)),
            ],
            'apdex' => [
                'current' => random_int(70, 99) / 100,
                'previous' => random_int(70, 99) / 100,
                'change_percentage' => random_int(-10, 10),
            ],
            'cpu_usage' => [
                'current' => random_int(10, 90),
                'previous' => random_int(10, 90),
                'change_percentage' => random_int(-20, 20),
            ],
            'memory_usage' => [
                'current' => random_int(1, 8),
                'previous' => random_int(1, 8),
                'change_percentage' => random_int(-20, 20),
            ],
            'endpoints' => array_map(fn ($i): array => [
                'path' => '/api/'.['users', 'products', 'orders', 'auth', 'settings'][$i % 5].'/'.random_int(1, 100),
                'method' => ['GET', 'POST', 'PUT', 'DELETE'][random_int(0, 3)],
                'avg_response_time' => random_int(50, 500),
                'p95_response_time' => random_int(100, 1000),
                'error_rate' => random_int(0, 10) / 100,
                'throughput' => random_int(10, 100),
            ], range(0, 9)),
        ];

        // Sample recent errors
        $recentErrors = [];
        for ($i = 0; $i < 10; $i++) {
            $recentErrors[] = [
                'id' => uniqid(),
                'message' => 'Error: '.['Undefined variable', 'Null pointer exception', 'Memory allocation failed', 'Connection timeout', 'API rate limit exceeded'][random_int(0, 4)],
                'type' => ['Exception', 'Error', 'Warning', 'Fatal Error', 'Notice'][random_int(0, 4)],
                'count' => random_int(1, 100),
                'first_seen' => now()->subHours(random_int(1, 24))->toIso8601String(),
                'last_seen' => now()->subMinutes(random_int(1, 60))->toIso8601String(),
                'status' => ['unresolved', 'resolved', 'muted'][random_int(0, 2)],
                'environment' => ['production', 'staging', 'development', 'testing'][random_int(0, 3)],
            ];
        }

        // Sample team members
        $teamMembers = [];
        for ($i = 0; $i < 5; $i++) {
            $teamMembers[] = [
                'id' => $i + 1,
                'name' => ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sam Wilson', 'Taylor Swift'][random_int(0, 4)],
                'email' => 'user'.($i + 1).'@example.com',
                'role' => ['owner', 'admin', 'developer', 'viewer'][random_int(0, 3)],
                'avatar' => 'https://ui-avatars.com/api/?name='.urlencode(['John Doe', 'Jane Smith', 'Alex Johnson', 'Sam Wilson', 'Taylor Swift'][random_int(0, 4)]),
                'last_active' => now()->subMinutes(random_int(1, 60))->diffForHumans(),
                'status' => ['online', 'away', 'offline'][random_int(0, 2)],
                'joined_at' => now()->subDays(random_int(1, 365))->toIso8601String(),
                'contributions' => random_int(10, 500),
                'recent_activity' => [
                    [
                        'action' => ['Fixed a bug', 'Deployed a release', 'Updated documentation', 'Added a feature'][random_int(0, 3)],
                        'timestamp' => now()->subHours(random_int(1, 48))->toIso8601String(),
                    ],
                ],
            ];
        }

        // Sample releases
        $releases = [];
        for ($i = 0; $i < 8; $i++) {
            $releases[] = [
                'id' => uniqid(),
                'version' => 'v1.'.random_int(0, 9).'.'.random_int(0, 9),
                'description' => ['Bug fixes and improvements', 'New features', 'Performance enhancements', 'Security updates'][random_int(0, 3)],
                'created_at' => now()->subDays(random_int(1, 30))->toIso8601String(),
                'author' => ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sam Wilson'][random_int(0, 3)],
                'commit_hash' => mb_substr(md5(uniqid()), 0, 8),
                'status' => ['deployed', 'pending', 'failed'][random_int(0, 2)],
                'environment' => ['production', 'staging', 'development'][random_int(0, 2)],
                'changes' => [
                    [
                        'type' => ['feature', 'bugfix', 'improvement', 'other'][random_int(0, 3)],
                        'description' => ['Added new login page', 'Fixed memory leak', 'Improved loading time', 'Updated dependencies'][random_int(0, 3)],
                    ],
                    [
                        'type' => ['feature', 'bugfix', 'improvement', 'other'][random_int(0, 3)],
                        'description' => ['Enhanced security', 'Fixed UI bug', 'Optimized database queries', 'Added documentation'][random_int(0, 3)],
                    ],
                ],
                'error_count' => random_int(0, 10),
            ];
        }

        // Sample alerts
        $alerts = [];
        for ($i = 0; $i < 6; $i++) {
            $alerts[] = [
                'id' => uniqid(),
                'name' => ['High CPU Usage', 'Memory Leak', 'API Error Rate', 'Slow Response Time', 'Database Connection Issues', 'Disk Space Warning'][random_int(0, 5)],
                'description' => ['Alert triggered due to high resource usage', 'Performance degradation detected', 'Error rate exceeded threshold', 'System resources running low'][random_int(0, 3)],
                'status' => ['active', 'resolved', 'snoozed'][random_int(0, 2)],
                'severity' => ['info', 'warning', 'error', 'critical'][random_int(0, 3)],
                'created_at' => now()->subDays(random_int(1, 14))->toIso8601String(),
                'resolved_at' => random_int(0, 1) !== 0 ? now()->subDays(random_int(1, 7))->toIso8601String() : null,
                'metric' => ['cpu_usage', 'memory_usage', 'error_rate', 'response_time', 'disk_space', 'api_availability'][random_int(0, 5)],
                'condition' => ['>', '<', '>=', '<='][random_int(0, 3)],
                'threshold' => random_int(70, 99),
                'current_value' => random_int(50, 100),
                'triggered_count' => random_int(1, 20),
            ];
        }

        return Inertia::render('application/application', [
            'application' => $application,
            'errorStats' => $errorStats,
            'performanceData' => $performanceData,
            'recentErrors' => $recentErrors,
            'teamMembers' => $teamMembers,
            'releases' => $releases,
            'alerts' => $alerts,
        ]);
    }
}
