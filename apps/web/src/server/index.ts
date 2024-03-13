import jwt from 'jsonwebtoken';
import { router } from './trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from "cors";
import { userRouter } from './routers/userRouter';
import { emailRouter } from './routers/emailRouter';
import { searchRouter } from './routers/searchRouter';
import { friendsRouter } from './routers/friendsRouter';
import { chatRouter } from './routers/chatRouter';
import { serverRouter } from './routers/serverRouter';
import { botRouter } from './routers/botRouter';
export const secret = 'Se3rEt';

// using trpc
export const appRouter = router({
    user: userRouter,
    email: emailRouter,
    search: searchRouter,
    friends: friendsRouter,
    chat: chatRouter,
    server: serverRouter,
    bots: botRouter
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext(opts) {
        let authHeader = opts.req.headers["authorization"];
        console.log('index')

        console.log('first');

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
});
   
server.listen(3000);