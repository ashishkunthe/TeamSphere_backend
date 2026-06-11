import { z } from "zod";

export const roomCreateTypes = z.object({
  name: z.string().min(3).max(16),
  description: z.string().min(8).max(50),
});
