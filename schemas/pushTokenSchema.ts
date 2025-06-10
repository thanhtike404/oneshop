

import { z } from "zod";

export const pushTokenSchema = z.object({
  token: z.string({
    required_error: "Push token is required",
  }),
  userId: z.string({
    required_error: "User ID is required",
  }),
  platform: z.string({
    required_error: "Platform is required",
  }),
});
