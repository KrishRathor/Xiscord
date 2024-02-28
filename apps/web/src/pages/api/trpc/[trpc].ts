import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server';
import jwt from "jsonwebtoken";
export const secret = 'Se3rEt';

function createContext(opts: any) {
    let authHeader = opts.req.headers["authorization"];

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        return new Promise((resolve) => {
          jwt.verify(token, secret, (err: any, user: any) => {
              if (user) {
                  resolve({userId: user.email as string});
              } else {
                  resolve({});
              }
          });
      })

    }

    return {};
}

export default createNextApiHandler({
  router: appRouter,
  createContext,
});
