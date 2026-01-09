import { featuresData } from '@/data/landing-page-data';
import { cn } from '@/lib/utils';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Activity, AlertTriangle, BarChart, Bell, Brain, CheckCircle2, Code, LucideIcon, Plug, Sparkles, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Map of icon names to their components
const iconMap: Record<string, LucideIcon> = {
    activity: Activity,
    brain: Brain,
    plug: Plug,
    users: Users,
    bell: Bell,
    'bar-chart': BarChart,
};

// Color mappings for features
const featureColors: Record<string, { bg: string; text: string; accent: string }> = {
    'real-time': { bg: 'bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', accent: 'bg-blue-500/10' },
    'ai-insights': { bg: 'bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', accent: 'bg-purple-500/10' },
    'easy-integration': { bg: 'bg-green-500/20', text: 'text-green-600 dark:text-green-400', accent: 'bg-green-500/10' },
    'team-collab': { bg: 'bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', accent: 'bg-amber-500/10' },
    'custom-alerts': { bg: 'bg-red-500/20', text: 'text-red-600 dark:text-red-400', accent: 'bg-red-500/10' },
    performance: { bg: 'bg-teal-500/20', text: 'text-teal-600 dark:text-teal-400', accent: 'bg-teal-500/10' },
};

interface StoryFeatureProps {
    feature: (typeof featuresData)[0];
    index: number;
}

const StoryFeature = ({ feature, index }: StoryFeatureProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const IconComponent = iconMap[feature.icon];

    // Alternate layout for odd/even features
    const isEven = index % 2 === 0;

    // Get color scheme for this feature
    const colorScheme = featureColors[feature.id] || { bg: 'bg-primary/10', text: 'text-primary', accent: 'bg-primary/5' };

    // Highlight a key word in the title
    const highlightTitleWord = (title: string) => {
        const words = title.split(' ');
        const highlightIndex = words.length > 1 ? 1 : 0; // Highlight second word or first if only one word

        return words.map((word, i) =>
            i === highlightIndex ? (
                <span key={i} className={`${colorScheme.text} font-bold`}>
                    {word}{' '}
                </span>
            ) : (
                <span key={i}>{word} </span>
            ),
        );
    };

    return (
        <div ref={ref} className={cn('flex min-h-[80vh] items-center py-20', isEven ? 'bg-background' : colorScheme.accent)}>
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className={cn('grid grid-cols-1 items-center gap-12 lg:grid-cols-2', isEven ? 'lg:grid-flow-row' : 'lg:grid-flow-row-dense')}>
                    {/* Text Content */}
                    <motion.div
                        className={cn('space-y-6', isEven ? 'lg:order-1' : 'lg:order-2')}
                        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', colorScheme.bg)}>
                                {IconComponent && <IconComponent className="text-primary dark:text-primary-foreground h-6 w-6" />}
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight">{highlightTitleWord(feature.title)}</h3>
                        </div>

                        <p className="text-muted-foreground text-xl">{feature.description}</p>

                        <ul className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <motion.li
                                    key={item}
                                    className="flex items-start gap-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5, delay: 0.2 * item, ease: 'easeOut' }}
                                >
                                    <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-purple-500" />
                                    <span className="text-lg">{getFeatureBenefit(feature.id, item)}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Visual Content */}
                    <motion.div
                        className={cn('relative h-[400px] lg:h-[500px]', isEven ? 'lg:order-2' : 'lg:order-1')}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <FeatureVisual featureId={feature.id} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const FeatureVisual = ({ featureId }: { featureId: string }) => {
    // Different visuals based on feature type
    switch (featureId) {
        case 'real-time':
            return <RealTimeMonitoringVisual />;
        case 'ai-insights':
            return <AIInsightsVisual />;
        case 'easy-integration':
            return <IntegrationVisual />;
        case 'team-collab':
            return <TeamCollaborationVisual />;
        case 'custom-alerts':
            return <AlertsVisual />;
        case 'performance':
            return <PerformanceVisual />;
        default:
            return <div className="bg-muted flex h-full w-full items-center justify-center rounded-xl">Feature Visual</div>;
    }
};

// Feature-specific visuals
const RealTimeMonitoringVisual = () => {
    const [alerts, setAlerts] = useState<Array<{ id: number; severity: 'low' | 'medium' | 'high' }>>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const severity = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high';
            setAlerts((prev) => [...prev.slice(-5), { id: Date.now(), severity }]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-xl backdrop-blur-sm dark:border-blue-800/50 dark:from-blue-950/30 dark:to-blue-900/20">
            <div className="mb-6 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Exception Monitor</h4>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                    <span className="text-sm">Live</span>
                </div>
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        className={cn(
                            'flex items-center gap-3 rounded-lg border p-4',
                            alert.severity === 'high'
                                ? 'border-red-500/30 bg-red-500/10'
                                : alert.severity === 'medium'
                                  ? 'border-amber-500/30 bg-amber-500/10'
                                  : 'border-blue-500/30 bg-blue-500/10',
                        )}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AlertTriangle
                            className={cn(
                                'h-5 w-5',
                                alert.severity === 'high' ? 'text-red-500' : alert.severity === 'medium' ? 'text-amber-500' : 'text-blue-500',
                            )}
                        />
                        <div>
                            <div className="text-sm font-medium">
                                {alert.severity === 'high'
                                    ? 'Critical Exception'
                                    : alert.severity === 'medium'
                                      ? 'Warning Exception'
                                      : 'Info Exception'}
                            </div>
                            <div className="text-muted-foreground text-xs">{new Date().toLocaleTimeString()}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const AIInsightsVisual = () => {
    const [analyzing, setAnalyzing] = useState(true);
    const [showSolution, setShowSolution] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnalyzing(false);
            setShowSolution(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-xl backdrop-blur-sm dark:border-purple-800/50 dark:from-purple-950/30 dark:to-purple-900/20">
            <h4 className="mb-6 text-lg font-semibold">AI Analysis</h4>

            <div className="space-y-6">
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <div className="font-mono text-sm">
                        <div className="mb-2 font-semibold text-red-500">Illuminate\Database\QueryException: SQLSTATE[42S22]</div>
                        <div className="text-muted-foreground">Column not found: 1054 Unknown column 'users.avatar' in 'field list'</div>
                        <div className="text-muted-foreground mt-1">at app/Http/Controllers/UserController.php:42</div>
                    </div>
                </div>

                {analyzing ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="relative h-16 w-16">
                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-400/30 border-t-purple-500"></div>
                            <Brain className="absolute inset-0 m-auto h-8 w-8 text-purple-500" />
                        </div>
                        <div className="mt-4 text-lg font-medium">AI analyzing exception...</div>
                    </div>
                ) : (
                    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <Sparkles className="mt-1 h-5 w-5 flex-shrink-0 text-purple-500" />
                                <div>
                                    <div className="mb-1 font-medium">AI Suggested Solution</div>
                                    <div className="text-muted-foreground text-sm">
                                        Create a migration to add the avatar column to the users table:
                                    </div>
                                    <div className="bg-background mt-2 rounded border p-3 font-mono text-xs">
                                        {`php artisan make:migration add_avatar_to_users_table --table=users

// In the migration file:
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('avatar')->nullable();
    });
}`}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <Brain className="mt-1 h-5 w-5 flex-shrink-0 text-amber-500" />
                                <div>
                                    <div className="mb-1 font-medium">Root Cause Analysis</div>
                                    <div className="text-muted-foreground text-sm">
                                        The code is trying to select the 'avatar' column from the users table, but this column doesn't exist in your
                                        database schema.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <Code className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                                <div>
                                    <div className="mb-1 font-medium">Affected Code</div>
                                    <div className="bg-background mt-1 rounded p-2 font-mono text-sm">
                                        {`// UserController.php
public function show($id)
{
    return User::select('id', 'name', 'email', 'avatar')
               ->findOrFail($id);
}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const IntegrationVisual = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border border-green-200/50 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-xl backdrop-blur-sm dark:border-green-800/50 dark:from-green-950/30 dark:to-green-900/20">
            <h4 className="mb-6 text-lg font-semibold text-green-800 dark:text-green-300">Quick Integration</h4>

            <div className="space-y-6">
                <div className="relative">
                    {/* Position the line to touch the left edge of the circles */}
                    <div className="absolute top-3 bottom-0 left-4 w-0.5 bg-green-300 dark:bg-green-700"></div>

                    {[
                        { title: 'Install Package', code: 'composer require exceptor/laravel-exceptor' },
                        { title: 'Publish Config', code: 'php artisan vendor:publish --provider=Exceptor\\ServiceProvider' },
                        { title: 'Add API Key', code: 'EXCEPTOR_API_KEY=your-api-key' },
                        { title: "You're Done!", code: '// Automatic exception tracking enabled' },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className={cn('relative pb-8 pl-12', step === index ? 'opacity-100' : 'opacity-50')}
                            animate={{ opacity: step === index ? 1 : 0.5 }}
                        >
                            <div
                                className={cn(
                                    'absolute top-0 left-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white dark:bg-gray-900',
                                    step === index ? 'border-green-500 bg-green-500/20' : 'border-muted-foreground',
                                )}
                            >
                                {step > index ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <span className="text-xs">{index + 1}</span>}
                            </div>
                            <div className="mb-2 font-medium">{item.title}</div>
                            <div className="bg-background rounded border p-3 font-mono text-xs">{item.code}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TeamCollaborationVisual = () => {
    return (
        <div className="h-full w-full overflow-hidden rounded-xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100 p-6 shadow-xl backdrop-blur-sm dark:border-amber-800/50 dark:from-amber-950/30 dark:to-amber-900/20">
            <h4 className="mb-6 text-lg font-semibold">Team Collaboration</h4>

            <div className="space-y-4">
                <div className="bg-background rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                            <span className="font-medium">JD</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">John Doe</div>
                                <div className="text-muted-foreground text-xs">2m ago</div>
                            </div>
                            <div className="mt-1 text-sm">
                                I've identified the issue in the payment processor. It's a race condition when multiple requests come in.
                            </div>
                            <div className="mt-2 flex gap-2">
                                <div className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-600 dark:text-amber-400">payment</div>
                                <div className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-600 dark:text-red-400">critical</div>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    className="bg-background rounded-lg border p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                            <span className="font-medium">AS</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">Alice Smith</div>
                                <div className="text-muted-foreground text-xs">Just now</div>
                            </div>
                            <div className="mt-1 text-sm">I'll implement a queue system to handle this. Assigning to myself.</div>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-600 dark:text-amber-400">in progress</div>
                                <div className="rounded-full bg-purple-500/10 px-2 py-1 text-xs text-purple-600 dark:text-purple-400">assigned</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const AlertsVisual = () => {
    const [selectedChannel, setSelectedChannel] = useState('slack');

    return (
        <div className="h-full w-full overflow-hidden rounded-xl border border-red-200/50 bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-xl backdrop-blur-sm dark:border-red-800/50 dark:from-red-950/30 dark:to-red-900/20">
            <h4 className="mb-6 text-lg font-semibold">Alert Configuration</h4>

            <div className="space-y-6">
                <div className="bg-background rounded-lg border p-4">
                    <div className="mb-3 font-medium">Alert Channels</div>
                    <div className="flex gap-2">
                        {[
                            { id: 'slack', name: 'Slack' },
                            { id: 'email', name: 'Email' },
                            { id: 'sms', name: 'SMS' },
                            { id: 'webhook', name: 'Webhook' },
                        ].map((channel) => (
                            <button
                                key={channel.id}
                                className={cn(
                                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                                    selectedChannel === channel.id ? 'bg-red-500 text-white' : 'bg-muted hover:bg-muted/80',
                                )}
                                onClick={() => setSelectedChannel(channel.id)}
                            >
                                {channel.name}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    className="space-y-4"
                    key={selectedChannel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-background rounded-lg border p-4">
                        <div className="mb-3 font-medium">Alert Conditions</div>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input type="checkbox" id="critical" className="mr-2" defaultChecked />
                                <label htmlFor="critical" className="text-sm">
                                    Critical errors
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="repeated" className="mr-2" defaultChecked />
                                <label htmlFor="repeated" className="text-sm">
                                    Repeated errors (more than 3 times in 5 minutes)
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="performance" className="mr-2" />
                                <label htmlFor="performance" className="text-sm">
                                    Performance degradation
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background rounded-lg border p-4">
                        <div className="mb-3 font-medium">Recipients</div>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-sm text-red-600 dark:text-red-400">
                                <span>Dev Team</span>
                                <button className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20 text-xs">×</button>
                            </div>
                            <div className="flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-sm text-red-600 dark:text-red-400">
                                <span>DevOps</span>
                                <button className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20 text-xs">×</button>
                            </div>
                            <div className="flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-sm text-red-600 dark:text-red-400">
                                <span>john@example.com</span>
                                <button className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20 text-xs">×</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const PerformanceVisual = () => {
    const generateRandomData = (length: number, min: number, max: number) => {
        return Array.from({ length }, () => min + Math.random() * (max - min));
    };

    const [cpuData] = useState(generateRandomData(7, 10, 80));
    const [memoryData] = useState(generateRandomData(7, 20, 60));
    const [responseData] = useState(generateRandomData(7, 100, 500));

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="bg-card/50 border-border/50 h-full w-full overflow-hidden rounded-xl border p-6 shadow-xl backdrop-blur-sm">
            <h4 className="mb-6 text-lg font-semibold">Performance Metrics</h4>

            <div className="space-y-6">
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">CPU Usage</div>
                        <div className="text-muted-foreground text-sm">Last 7 days</div>
                    </div>
                    <div className="flex h-24 items-end gap-1">
                        {cpuData.map((value, index) => (
                            <motion.div
                                key={index}
                                className="bg-primary/80 flex-1 rounded-t"
                                style={{ height: `${value}%` }}
                                initial={{ height: 0 }}
                                animate={{ height: `${value}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="h-full"></div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                        {days.map((day) => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">Memory Usage</div>
                        <div className="text-muted-foreground text-sm">Last 7 days</div>
                    </div>
                    <div className="flex h-24 items-end gap-1">
                        {memoryData.map((value, index) => (
                            <motion.div
                                key={index}
                                className="flex-1 rounded-t bg-purple-500/80"
                                style={{ height: `${value}%` }}
                                initial={{ height: 0 }}
                                animate={{ height: `${value}%` }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            >
                                <div className="h-full"></div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                        {days.map((day) => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">Response Time (ms)</div>
                        <div className="text-muted-foreground text-sm">Last 7 days</div>
                    </div>
                    <div className="flex h-24 items-end gap-1">
                        {responseData.map((value, index) => (
                            <motion.div
                                key={index}
                                className="flex-1 rounded-t bg-blue-500/80"
                                style={{ height: `${(value / 500) * 100}%` }}
                                initial={{ height: 0 }}
                                animate={{ height: `${(value / 500) * 100}%` }}
                                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                            >
                                <div className="h-full"></div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                        {days.map((day) => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to get feature-specific benefits
const getFeatureBenefit = (featureId: string, index: number): string => {
    const benefits = {
        'real-time': ['Instant notification when errors occur', 'Complete stack traces and context', 'Track error frequency and patterns'],
        'ai-insights': ['AI-powered root cause analysis', 'Suggested code fixes and solutions', 'Similar issue detection and correlation'],
        'easy-integration': ['Simple installation with composer', 'Works with any Laravel application', 'No code changes required'],
        'team-collab': ['Assign issues to team members', 'Comment and discuss solutions', 'Track resolution progress'],
        'custom-alerts': ['Configure alerts based on severity', 'Multiple notification channels', 'Smart grouping to reduce noise'],
        performance: ['Monitor application performance', 'Track resource usage over time', 'Identify performance bottlenecks'],
    };

    return benefits[featureId as keyof typeof benefits]?.[index - 1] || 'Improve your application stability';
};

export function FeaturesStorytellingSection() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    return (
        <section id="features-story" ref={ref} className="relative">
            {/* Sticky header */}
            <motion.div className="bg-background/80 sticky top-0 z-10 border-b py-10 backdrop-blur-sm" style={{ opacity }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">The Exceptor Experience</h2>
                        <p className="text-muted-foreground mt-4 text-xl">See how Exceptor transforms your error handling workflow</p>
                    </div>
                </div>
            </motion.div>

            {/* Feature stories */}
            <div>
                {featuresData.map((feature, index) => (
                    <StoryFeature key={feature.id} feature={feature} index={index} />
                ))}
            </div>
        </section>
    );
}
