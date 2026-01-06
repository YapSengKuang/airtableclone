import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


// JSON-safe Zod schema 
const json: z.ZodType<unknown> = z.lazy(() =>
    z.union([ 
        z.string(), 
        z.number(), 
        z.boolean(), 
        z.null(), 
        z.array(json), 
        z.record(json), 
    ]) 
);

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
            value: input.value,
        },
      });
    }),
});
