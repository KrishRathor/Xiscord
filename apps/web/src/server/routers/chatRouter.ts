import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "../statusCode";

const prisma = new PrismaClient();

export const chatRouter = router({
    sendMessage: publicProcedure
        .input(z.object({
            content: z.string(),
            to: z.string()
        }))
        .use(isLoggedIn)
        .mutation(async opts => {
            const { content, to } = opts.input;
            const { userId } = opts.ctx;

            try {

                if (!userId) {
                    return {
                        code: HttpStatusCode.NotFound,
                        message: 'User not found',
                        msg: null
                    }
                }

                const user = await prisma.user.findFirst({
                    where: {
                        email: userId
                    }
                })

                if (!user) {
                    return;
                }

                const msg = await prisma.message.create({
                    data: {
                        toUsername: to,
                        fromUsername: user.username,
                        content: content
                    }
                })

                return {
                    code: HttpStatusCode.OK,
                    message: 'Message sent',
                    msg
                }

            } catch (err) {
                console.log(err);
            } finally {
                await prisma.$disconnect();
            }

        }),
    getAllMessages: publicProcedure
        .input(z.object({
            fromUsername: z.string(),
        }))
        .use(isLoggedIn)
        .mutation(async opts => {
            const { fromUsername } = opts.input;
            const { userId } = opts.ctx;

            try {

                if (!userId) {
                    return {
                        code: HttpStatusCode.Unauthorized,
                        message: 'User not authorized',
                        msg: null
                    }
                }

                const user = await prisma.user.findFirst({
                    where: {
                        email: userId
                    }
                });

                if (!user) {
                    return {
                        code: HttpStatusCode.NotFound,
                        message: 'User not found'
                    }
                }

                const msg = await prisma.message.findMany({
                    where: {
                        fromUsername: fromUsername,
                        toUsername: user.username
                    }
                })

                return {
                    code: HttpStatusCode.OK,
                    message: 'conversation found',
                    msg
                }

            } catch (err) {
                console.log(err);
            } finally {
                await prisma.$disconnect();
            }

        })
    
})