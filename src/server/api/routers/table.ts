
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
            const table = ctx.db.table.create({
                data: {
                    base_id: input.baseId,
                    table_name: input.tableName,
                },
            });

            const defaultField = await ctx.db.field.createMany({
                data: [
                    {
                        table_id: (await table).id,
                        name: "Name",
                        type: "text",
                        options: {},
                        order_index: 0,
                    },
                    {
                        table_id: (await table).id,
                        name: "Notes",
                        type: "text",
                        options: {},
                        order_index: 1,
                    },
                ],
            });

            const fields = await ctx.db.field.findMany({
                where: { table_id: (await table).id },
            });

            const row = await ctx.db.row.create({
                data: {
                    table_id: (await table).id,
                },
            });

            await ctx.db.cell.createMany({
                data: fields.map((f) => ({
                    field_id: f.id,
                    row_id: row.id,
                    value: {}
        
                })),
            });
            console.log("Creating table:", input.tableName);
            console.log("Created table:", (await table).id);

            console.log("Default fields created");
            console.log("Row created:", row.id);
            console.log("Cells created for row:", row.id);

            return table;
        }),

});
