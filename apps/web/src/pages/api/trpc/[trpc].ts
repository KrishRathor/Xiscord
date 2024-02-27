import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server';
import jwt from "jsonwebtoken";
export const SECRET = 'SECr3t';

function createContext(opts: any) {
    let authHeader = opts.req.headers["authorization"];

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(token);
        return new Promise<{userId?: string}>((resolve) => {
            jwt.verify(token, SECRET, (err: any, user: any) => {
                if (user) {
                    resolve({userId: user.userId as string});
                } else {
                    resolve({});
                }
            });
        })
    }

    return {}
}

export default createNextApiHandler({
  router: appRouter,
  createContext,
});