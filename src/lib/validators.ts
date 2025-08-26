import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export const quizAnswerSchema = z.object({
  key: z.string(),
  value: z.any(),
});

export const quizSchema = z.object({
  sessionId: z.string().uuid(),
  email: z.string().email().optional(),
  answers: z.array(quizAnswerSchema).default([]),
  complete: z.boolean().optional(),
});

export const quizBrandsSchema = z
  .object({
    quiz_id: z.string().uuid(),
    favorite_brand_ids: z.array(z.string().uuid()).default([]),
    custom_brand_names: z.array(z.string().min(2).max(50)).default([]),
    auto_pick_brands: z.boolean().default(false),
  })
  .superRefine((val, ctx) => {
    if (val.favorite_brand_ids.length + val.custom_brand_names.length > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Too many brands",
        path: ["favorite_brand_ids"],
      });
    }
  });

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type QuizInput = z.infer<typeof quizSchema>;
export type QuizBrandsInput = z.infer<typeof quizBrandsSchema>;
