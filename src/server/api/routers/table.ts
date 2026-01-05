
import { TRPCError } from "node_modules/@trpc/server/dist/index.cjs";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,

} from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
   
   // to get tables by base ID
    getByBaseId: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    let tables = await ctx.db.table.findMany({
      where: {
        base_id: input.id,
      },
      orderBy: {
        table_name: "asc",
      },
      include: {
        fields: true, // include all fields
        rows: {
          include: {
            cells: {
              include: {
                field: true, // include field info for each cell
              },
            },
          },
        },
      },
    });

    if (!tables || tables.length === 0) {
        const newTable = await ctx.db.table.create({
            data: {
            base_id: input.id,
            table_name: "Table 1",
            },
        });
    
        // Re-fetch including relations
        tables = await ctx.db.table.findMany({
            where: { base_id: input.id },
            orderBy: { table_name: "asc" },
            include: {
                fields: true,
                rows: {
                    include: {
                        cells: {
                            include: { field: true },
                        },
                    },
                },
            },
        });
}

    return tables;
  }),

    // to create a new table
    create: protectedProcedure
        .input(
            z.object({
            baseId: z.string(),
            tableName: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.table.create({
            data: {
                base_id: input.baseId,
                table_name: input.tableName,
            },
            });
        }),

});
