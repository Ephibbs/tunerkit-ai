'use client';
import React, { useState } from 'react';
import Link from "next/link";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import SaveOpenAIKeySection from "@/components/SaveOpenAIKey";
import UserAuthPicker from "@/components/ui/user-auth-picker";
import { RateLimitSetter } from "@/components/rate-limit-setter";
import CodeBlock from "@/components/ui/code-block";
import CORSManagement from "@/components/cors-management";

const OnboardingStep = ({ title, children, onPrevious, onNext, isFirstStep, isLastStep }: any) => (
    <Card className="w-full max-w-lg mx-auto my-4">
        <CardHeader>
            <h2 className="text-xl font-bold text-center">{title}</h2>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className={`flex justify-between ${isFirstStep ? 'hidden' : ''}`}>
            <Button
                onClick={onPrevious}
                disabled={isFirstStep}
            >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
                onClick={onNext}
                disabled={isLastStep}
            >
                Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
    </Card>
);

const UserOnboardingFlow = ({ project, params }: any) => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        {
            title: "Welcome to Backless AI!",
            content: (
                <div className="text-center">
                    <p className="mb-4">Your platform for building & monitoring AI-powered applications.</p>
                    <p className="mb-4">Let's set up your first project!</p>
                    <Button onClick={() => setCurrentStep(1)}>Get Started</Button>
                </div>
            )
        },
        {
            title: "1. Save your OpenAI Key",
            content: <SaveOpenAIKeySection />
        },
        {
            title: "2. Import Backless AI",
            content: (
                <div className="text-center">
                    <CodeBlock copyText={'npm i backless-ai'} language="bash">npm i backless-ai</CodeBlock>
                    <div className="mt-4">
                        <CodeBlock language="bash" copyText={`import { OpenAIClient } from 'backless-ai';\n\nconst openai = OpenAIClient('${project.id}');`}>
                            import {'{'} OpenAIClient {'}'} from 'backless-ai';<br /><br />
                            const openai = OpenAIClient('{project.id}');
                        </CodeBlock>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">Use this code in your frontend JavaScript to get started!</p>
                </div>
            )
        },
        {
            title: "3. Configure User Authentication",
            content: (
                <div>
                    <h3 className="font-semibold mb-2">User Authentication</h3>
                    <UserAuthPicker project={project} />
                </div>
            )
        },
        {
            title: "4. Use our Pre-built AI Features",
            content: (
                <div className="text-center">
                    <p className="mb-4">We have pre-built AI components to help you get started quickly.</p>
                    <Link href="/docs" className="text-blue-500 hover:underline" target="_blank">Browse Components</Link>
                </div>
            )
        },
        {
            title: "5. Monitor Usage",
            content: (
                <div className="text-center">
                    <p className="mb-4">View usage and request logs in your dashboard, split by project and user.</p>
                    <Link href="/" className="text-blue-500 hover:underline" target="_blank">Go to Dashboard</Link>
                </div>
            )
        },
        {
            title: "You're All Set!",
            content: (
                <div className="text-center">
                    <p className="mb-4">Start building the future of AI-powered applications!</p>
                    <Link href="/docs" className="text-blue-500 hover:underline">View Documentation</Link>
                </div>
            )
        },
        // {
        //     title: "4. Set User Rate Limit",
        //     content: (
        //         <div>
        //             <h3 className="font-semibold mb-2">User Rate Limit</h3>
        //             <RateLimitSetter
        //                 projectId={params.id}
        //                 rateLimit={project.user_rate_limit}
        //                 ratePeriod={project.user_rate_period}
        //                 type={'project_user'}
        //                 unit={'cents'}
        //             />
        //         </div>
        //     )
        // },
        // {
        //     title: "5. Set Project Rate Limit",
        //     content: (
        //         <div>
        //             <h3 className="font-semibold mb-2">Project Rate Limit</h3>
        //             <RateLimitSetter
        //                 projectId={params.id}
        //                 rateLimit={project.rate_limit}
        //                 ratePeriod={project.rate_period}
        //                 type={'project'}
        //                 unit={'cents'}
        //             />
        //         </div>
        //     )
        // },
        // {
        //     title: "6. Manage CORS Settings",
        //     content: <CORSManagement projectId={params.id || null} />
        // },
    ];

    const goToPreviousStep = () => setCurrentStep(prev => Math.max(0, prev - 1));
    const goToNextStep = () => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Get Started with Backless AI</h1>
            <OnboardingStep
                title={steps[currentStep].title}
                onPrevious={goToPreviousStep}
                onNext={goToNextStep}
                isFirstStep={currentStep === 0}
                isLastStep={currentStep === steps.length - 1}
            >
                {steps[currentStep].content}
            </OnboardingStep>
        </div>
    );
};

export default UserOnboardingFlow;