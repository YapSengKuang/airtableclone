import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const baseRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
        return {
            greeting: `Hello ${input.text}`,
        };
        }),

    
    // to get all bases for a user
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.base.findMany(
            {
                where: { 
                    user_id: ctx.userId 
                },
                orderBy: { 
                    base_name: "asc" 
                }
            }
        );
    }),
    create: protectedProcedure
        .input(
            z.object({
                base_name: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newBase = await ctx.db.base.create({
                data: {
                    base_name: input.base_name,
                    user_id: ctx.userId,
                },
            });
            return newBase;
        }
        )
    

});
