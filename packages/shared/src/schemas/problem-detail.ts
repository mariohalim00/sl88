import { z } from 'zod';

/**
 * RFC 9457 Problem Details schema for non-2xx HTTP responses.
 * All API error responses MUST conform to this shape with content-type
 * `application/problem+json`.
 */
export const problemDetailSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int().min(100).max(599),
  detail: z.string().optional(),
  instance: z.string().optional(),
  traceId: z.string().optional(),
  errors: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    )
    .optional(),
});

export type ProblemDetail = z.infer<typeof problemDetailSchema>;

export function createProblemDetail(
  type: string,
  title: string,
  status: number,
  options?: {
    detail?: string;
    instance?: string;
    traceId?: string;
    errors?: Array<{ field: string; message: string }>;
  },
): ProblemDetail {
  return {
    type,
    title,
    status,
    ...options,
  };
}
