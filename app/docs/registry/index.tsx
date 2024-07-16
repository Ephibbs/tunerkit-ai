import * as React from "react";

import { Registry } from "@/app/docs/registry/schema";

export const registry: Registry = {
    "chat-example": {
        name: "chat-example",
        files: ["registry/components/chat-example.tsx"],
        component: React.lazy(() => import("./components/chat-example")),
    },
    "chat-bubble-example": {
        name: "chat bubble",
        files: ["registry/components/magic-card.tsx"],
    },
};



export type ComponentName = keyof Registry;