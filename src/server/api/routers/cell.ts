import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { Prisma } from "@prisma/client";

export const cellRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        cellId: z.string(),
        value: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cell.update({
        where: { id: input.cellId },
        data: { 
            value: input.value as Prisma.JsonValue
        },
      });
    }),
});
