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
  complete: z.boolean().default(false),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type QuizInput = z.infer<typeof quizSchema>;
