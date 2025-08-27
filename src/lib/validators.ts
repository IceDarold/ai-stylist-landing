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

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type QuizInput = z.infer<typeof quizSchema>;

export const brandSelectionSchema = z
  .object({
    quiz_id: z.string().uuid(),
    favorite_brand_ids: z.array(z.string().uuid()).max(3).default([]),
    custom_brand_names: z.array(z.string().min(2).max(50)).max(3).default([]),
    auto_pick_brands: z.boolean().default(false),
  })
  .refine(
    (data) => data.favorite_brand_ids.length + data.custom_brand_names.length <= 3,
    { message: "Too many brands" }
  );

export type BrandSelectionInput = z.infer<typeof brandSelectionSchema>;
