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
        files: ["registry/components/chat-bubble-example.tsx"],
        component: React.lazy(() => import("./components/chat-bubble-example")),
    },
    "autocomplete-example": {
        name: "chat bubble",
        files: ["registry/components/autocomplete-example.tsx"],
        component: React.lazy(() => import("./components/autocomplete-example")),
    },
    "autocomplete-email-example": {
        name: "chat bubble",
        files: ["registry/components/autocomplete-email-example.tsx"],
        component: React.lazy(() => import("./components/autocomplete-email-example")),
    },
    "tts-example": {
        name: "chat bubble",
        files: ["registry/components/tts-example.tsx"],
        component: React.lazy(() => import("./components/tts-example")),
    },
    "pii-detector-example": {
        name: "chat bubble",
        files: ["registry/components/pii-detector-example.tsx"],
        component: React.lazy(() => import("./components/pii-detector-example")),
    },
};


export type ComponentName = keyof Registry;