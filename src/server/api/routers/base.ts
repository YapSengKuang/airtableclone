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

    // added my me to fetch all bases
    // TODO: change to protectedProcedure when auth is set up    
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.db.base.findMany();
    }),

});
