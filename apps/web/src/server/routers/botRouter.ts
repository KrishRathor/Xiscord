import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "../statusCode";

const prisma = new PrismaClient();

export const botRouter = router({
    createBot: publicProcedure
        .input(z.object({
            botName: z.string()
        }))
        .use(isLoggedIn)
        .mutation(async opts => {
            const { botName } = opts.input;
            const { userId } = opts.ctx;

            try {

                if (!userId) {
                    return {
                        code: HttpStatusCode.Unauthorized,
                        message: 'not authorized',
                        bot: null
                    }
                }

                const user = await prisma.user.findFirst({
                    where: {
                        email: userId
                    }
                })

                if (!user) {
                    // not possible
                    return {
                        code: HttpStatusCode.NotFound,
                        message: 'user not found',
                        bot: null
                    }
                }

                const createBot = await prisma.bots.create({
                    data: {
                        botName: botName,
                        owner: user.email
                    }
                })

                return {
                    code: HttpStatusCode.Created,
                    message: 'created new bot',
                    bot: createBot
                }

            } catch (err) {
                console.error(err);
            } finally {
                await prisma.$disconnect();
            }
        })
})