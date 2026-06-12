import { z } from "zod";

export const fileTypes = z.object({
  description: z.string().min(3),
});
