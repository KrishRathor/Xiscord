import { middleware } from "../trpc";

export const isLoggedIn = middleware(async (opts) => {
    const { ctx } = opts;
    console.log('from middle', ctx);

    

    return opts.next();
});