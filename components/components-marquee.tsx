import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { useRouter } from "next/navigation";

const components = [
    {
        name: "AI Chat",
        body: "Engage users with a customizable AI-powered chat interface, perfect for customer support or interactive guides.",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "AI Chat Bubble",
        body: "Add a sleek, floating chat bubble to your site for instant AI assistance without disrupting user experience.",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "AI Autocomplete Input",
        body: "Enhance user input with AI-powered suggestions, boosting productivity and reducing errors in forms and search bars.",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Text to Speech",
        body: "Convert written content into natural-sounding speech, making your app more accessible and user-friendly.",
        img: "https://avatar.vercel.sh/jane",
    },
    // {
    //     name: "Image Recognition",
    //     body: "Implement powerful image analysis capabilities, from object detection to facial recognition, enhancing user interactions.",
    //     img: "https://avatar.vercel.sh/alex",
    // },
    {
        name: "Sentiment Analysis",
        body: "Gauge user emotions and feedback automatically, helping you respond appropriately to customer needs.",
        img: "https://avatar.vercel.sh/sam",
    },
    {
        name: "Language Translator",
        body: "Break language barriers with real-time AI-powered translation, making your app truly global.",
        img: "https://avatar.vercel.sh/taylor",
    },
    {
        name: "Smart Content Generator",
        body: "Create high-quality, context-aware content on the fly, perfect for dynamic websites and personalized user experiences.",
        img: "https://avatar.vercel.sh/morgan",
    },
    {
        name: "AI-Powered Search",
        body: "Implement intelligent search functionality that understands user intent and delivers highly relevant results.",
        img: "https://avatar.vercel.sh/casey",
    },
    {
        name: "Voice Command Interface",
        body: "Enable hands-free control of your app with advanced voice recognition and natural language processing.",
        img: "https://avatar.vercel.sh/jordan",
    },
];

const ReviewCard = ({
    img,
    name,
    body,
}: {
    img: string;
    name: string;
    body: string;
}) => {
    const router = useRouter();
    return (
        <figure
            className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}
            onClick={() => router.push("/docs")}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{name}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};

export function MarqueeDemo() {
    return (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
            <Marquee pauseOnHover className="[--duration:30s]">
                {components.map((review) => (
                    <ReviewCard key={review.name} {...review} />
                ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
    );
}
