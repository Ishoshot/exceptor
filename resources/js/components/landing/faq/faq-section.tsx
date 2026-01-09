import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqData } from '@/data/landing-page-data';

export function FAQSection() {
    return (
        <section id="faq" className="relative py-20">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="bg-primary/5 absolute -bottom-[20%] left-1/2 h-[60%] w-[80%] -translate-x-1/2 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 container">
                <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground text-xl">Everything you need to know about Exceptor</p>
                </div>

                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="w-full">
                        {faqData.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
