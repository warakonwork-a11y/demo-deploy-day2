import { z } from "zod";

export const borrowRequestSchema = z.object({
  equipmentId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().min(1).max(500)
});

export type BorrowRequestInput = z.infer<typeof borrowRequestSchema>;

export const adminUpdateTransactionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "RETURNED"]),
  remarks: z.string().max(500).optional()
});

export type AdminUpdateTransactionInput = z.infer<
  typeof adminUpdateTransactionSchema
>;

