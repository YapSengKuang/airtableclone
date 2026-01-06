
import { z } from "zod";
import { createDefaultTable } from "./helpers/createDefaultTable";
import type {Table, Field, Row, Cell} from "generated/prisma";

import {
  createTRPCRouter,
  protectedProcedure,

} from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
   
    getByBaseId: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }): Promise<
            Array<Table & { fields: Field[]; rows: Row[]; cells: Cell[] }>
            > => {

                let tables = await ctx.db.table.findMany({
                where: { base_id: input.id },
                orderBy: { table_name: "asc" },
                include: {
                    fields: true,
                    rows: true,
            },
            });

            // If no tables exist, create one and re-fetch
            if (tables.length === 0) {
                await createDefaultTable(ctx.db, input.id, "Table 1");

                tables = await ctx.db.table.findMany({
                    where: { base_id: input.id },
                    include: { fields: true, rows: true },
                });
            }


            // Fetch all cells for all rows in all tables
            const rows = tables.flatMap((t) => t.rows);
            const rowIds = rows.map((r) => r.id);

            const cells = await ctx.db.cell.findMany({
                where: { row_id: { in: rowIds } },
            });

            // Normalize return shape
            return tables.map((t) => ({
                ...t,
                cells: cells.filter((c) =>
                    t.rows.some((r) => r.id === c.row_id)
                ),
            }));
        }),
    create: protectedProcedure
        .input(
            z.object({
            baseId: z.string(),
            tableName: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return createDefaultTable(ctx.db, input.baseId, input.tableName);
        }),

});
