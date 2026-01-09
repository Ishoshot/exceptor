export interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar?: string;
}

export interface PricingTier {
    id: string;
    name: string;
    description: string;
    price: string;
    billingPeriod: string;
    features: string[];
    highlighted?: boolean;
    cta: string;
    ctaLink: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export const heroData = {
    headline: 'Exception Monitoring Made Simple',
    subheadline: 'Track, analyze, and resolve application errors with AI-powered insights.',
    ctaPrimary: 'Get Started',
    ctaSecondary: 'View Demo',
    ctaPrimaryLink: '/register',
    ctaSecondaryLink: '#demo',
};

export const featuresData: Feature[] = [
    {
        id: 'real-time',
        title: 'Real-time Monitoring',
        description: 'Track exceptions as they happen with instant notifications and detailed error context.',
        icon: 'activity',
    },
    {
        id: 'ai-insights',
        title: 'AI-Powered Analysis',
        description: 'Get intelligent insights and suggested fixes for your application errors.',
        icon: 'brain',
    },
    {
        id: 'easy-integration',
        title: 'Simple Integration',
        description: 'Set up in minutes with our Laravel package or API for any application type.',
        icon: 'plug',
    },
    {
        id: 'team-collab',
        title: 'Team Collaboration',
        description: 'Assign, comment, and resolve issues together with your development team.',
        icon: 'users',
    },
    {
        id: 'custom-alerts',
        title: 'Custom Alert Rules',
        description: 'Configure notification rules based on error type, frequency, or impact.',
        icon: 'bell',
    },
    {
        id: 'performance',
        title: 'Performance Metrics',
        description: 'Monitor application performance alongside error tracking for complete visibility.',
        icon: 'bar-chart',
    },
];

export const testimonialData: Testimonial[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        role: 'CTO',
        company: 'TechFlow',
        content: 'Exceptor has transformed how we handle errors. The AI insights have reduced our debugging time by 40%.',
    },
    {
        id: '2',
        name: 'Michael Chen',
        role: 'Lead Developer',
        company: 'DataSphere',
        content:
            'The real-time monitoring and detailed stack traces have been invaluable for our team. Exceptor is now an essential part of our workflow.',
    },
    {
        id: '3',
        name: 'Jessica Williams',
        role: 'Engineering Manager',
        company: 'Innovate Inc',
        content:
            "We've cut our error resolution time in half since implementing Exceptor. The team collaboration features are particularly impressive.",
    },
];

export const pricingData: PricingTier[] = [
    {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for small projects and individual developers',
        price: '$29',
        billingPeriod: 'per month',
        features: ['Up to 50,000 exceptions per month', '7-day data retention', 'Email notifications', 'Basic error grouping', '1 team member'],
        cta: 'Start Free Trial',
        ctaLink: '/register?plan=starter',
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Ideal for growing teams and applications',
        price: '$79',
        billingPeriod: 'per month',
        features: [
            'Up to 250,000 exceptions per month',
            '30-day data retention',
            'Email & Slack notifications',
            'Advanced error grouping',
            'AI-powered insights',
            'Up to 5 team members',
        ],
        highlighted: true,
        cta: 'Start Free Trial',
        ctaLink: '/register?plan=professional',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large-scale applications and organizations',
        price: '$199',
        billingPeriod: 'per month',
        features: [
            'Unlimited exceptions',
            '90-day data retention',
            'Custom integrations',
            'Priority support',
            'Advanced AI analysis',
            'Unlimited team members',
            'Custom reporting',
        ],
        cta: 'Contact Sales',
        ctaLink: '/contact-sales',
    },
];

export const faqData: FAQ[] = [
    {
        question: 'How does Exceptor integrate with my application?',
        answer: 'Exceptor provides a Laravel package for easy integration with Laravel applications. For other application types, we offer a simple API that can be used with any programming language or framework.',
    },
    {
        question: 'Can I try Exceptor before purchasing?',
        answer: "Yes, we offer a 14-day free trial with no credit card required. You'll have access to all features during the trial period.",
    },
    {
        question: 'How does the AI-powered analysis work?',
        answer: 'Our AI analyzes exception patterns, stack traces, and context to provide insights about the root cause and potential solutions. It learns from similar errors across our platform while maintaining strict privacy boundaries.',
    },
    {
        question: 'Is my data secure with Exceptor?',
        answer: 'Absolutely. We employ industry-standard encryption for all data in transit and at rest. We also offer data residency options for enterprise customers.',
    },
    {
        question: 'Can I customize notification rules?',
        answer: 'Yes, you can set up custom notification rules based on error type, frequency, environment, and more. Notifications can be sent via email, Slack, or webhooks.',
    },
];

export const statsData = [
    { value: '40%', label: 'Reduction in debugging time' },
    { value: '99.9%', label: 'Error capture rate' },
    { value: '5M+', label: 'Exceptions analyzed daily' },
    { value: '10k+', label: 'Happy developers' },
];
