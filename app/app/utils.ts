import { z } from "zod";

export const availableModels = [
  "gpt-4o-mini-2024-07-18",
  "gpt-4o-2024-05-13",
  "claude-3-haiku-20240307",
  "claude-3-5-sonnet-20240620",
] as const;

export const formSchema = z.object({
  url: z.string().url(),
  frequency: z.coerce.number().int().positive(),
  name: z.string().min(3).max(50),

  prompt: z.string().min(10).max(500),
  model: z.enum(availableModels),
});
