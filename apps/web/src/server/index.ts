import { publicProcedure, router } from './trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import jwt from "jsonwebtoken";
import cors from "cors";
import { isLoggedIn } from './middlewares/isLoggedIn';
export const SECRET = 'SECr3t';

// using trpc
export const appRouter = router({
    user: publicProcedure
        .use(isLoggedIn)
        .mutation(async opts => {
            return {
                message: 'from backend',
                code: opts,
            }
        })
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext(opts) {
        let authHeader = opts.req.headers["authorization"];

        // if (authHeader) {
        //     const token = authHeader.split(' ')[1];
        //     console.log(token);
        //     return new Promise<{userId?: string}>((resolve) => {
        //         jwt.verify(token, SECRET, (err, user) => {
        //             if (user) {
        //                 //@ts-ignore
        //                 resolve({userId: user.userId as string});
        //             } else {
        //                 resolve({});
        //             }
        //         });
        //     })
        // }

        return {
            userId: authHeader?.split(' ')[1]
        };
    }
});
   
server.listen(3000);