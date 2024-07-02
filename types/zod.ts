import { z } from "zod";

export const fileUploadFormSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z ]+$/, "Only letters and spaces are allowed"),
  authentication: z.enum(["none", "supabase"]),
});

export const settingsFormSchema = z.object({
  userRateLimit: z.number().int().min(1).max(1000),
  userRateLimitWindow: z.enum(["minute", "hour", "day", "week", "month"]),
  userSpendLimit: z.number().int().min(1).max(1000),
  userSpendLimitWindow: z.enum(["minute", "hour", "day", "week", "month"]),
  projectSpendLimit: z.number().int().min(1).max(1000),
  projectSpendLimitWindow: z.enum(["minute", "hour", "day", "week", "month"]),
});