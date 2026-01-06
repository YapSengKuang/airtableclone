import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


export const cellRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        cellId: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cell.update({
        where: { id: input.cellId },
        data: { 
            value: input.value,
        },
      });
    }),
});
