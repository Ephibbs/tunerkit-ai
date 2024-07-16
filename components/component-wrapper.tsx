import { cn } from "@/lib/utils";

interface ComponentWrapperProps {
    className?: string;
    children: any;
}
const ComponentWrapper = ({ className, children }: ComponentWrapperProps) => {
    return (
        <div
            className={cn(
                "max-w-screen relative flex flex-col items-center justify-center rounded-xl bg-background p-0 md:border md:p-16",
                className,
            )}
        >
            <div className="z-10">
                {children}
            </div>
            <div
                className={cn(
                    `absolute inset-0 size-full`,
                    `bg-[radial-gradient(#00000055_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff22_1px,transparent_1px)] z-0`,
                    "lab-bg [background-size:16px_16px]",
                )}
            />
        </div>
    );
};

export default ComponentWrapper;