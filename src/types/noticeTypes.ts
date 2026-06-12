import { z } from "zod";

export const noticeTypes = z.object({
  title: z.string().min(6).max(30),
  description: z.string().min(10),
});
