import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";

export const isLoggedIn = middleware(async (opts) => {

    if (!opts.ctx.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next();
});