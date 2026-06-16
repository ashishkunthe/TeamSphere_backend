import { z } from "zod";

export const registerTypes = z.object({
  username: z.string().min(3).max(16),
  email: z.email(),
  password: z.string().min(8).max(16),
});

export const loginTypes = z.object({
  email: z.email(),
  password: z.string().min(8).max(16),
});
