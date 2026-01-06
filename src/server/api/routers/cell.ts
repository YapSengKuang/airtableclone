import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


export const cellRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        cellId: z.string(),
        value: z.union([z.string(), z.number(), z.null()]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cell.update({
        where: { id: input.cellId },
        data: { 
            value: String(input.value),
        },
      });
    }),
});
