import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "../statusCode";

const prisma = new PrismaClient();

interface Ibots {
    username: string,
    botsName: string
};

export const botRouter = router({
    createBot: publicProcedure
        .input(z.object({
            botName: z.string()
        }))
        .use(isLoggedIn)
        .mutation(async opts => {
            const { botName } = opts.input;
            const { userId } = opts.ctx;
            console.log('first');

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
                    return {
                        code: HttpStatusCode.NotFound,
                        message: 'user not found',
                        bot: null
                    }
                }

                const preBot = await prisma.bots.findFirst({
                    where: {
                        botName: botName
                    }
                })

                if (preBot) {
                    return {
                        code: HttpStatusCode.BadRequest,
                        message: 'already created',
                        bot: preBot
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
        }),
    getAllBots: publicProcedure
        .mutation(async opts => {
            try {

                const bots = await prisma.bots.findMany();
                const data: Ibots[] = [];

                await Promise.all(bots.map(async item => {
                    const user = await prisma.user.findFirst({
                        where: {
                            email: item.owner
                        }
                    });
                    user && data.push({
                        username: user.username,
                        botsName: item.botName
                    });
                }));

                return {
                    code: HttpStatusCode.OK,
                    message: 'bots found',
                    bots: bots,
                    data: data
                };

            } catch (err) {
                console.log(err);
            } finally {
                await prisma.$disconnect()
            }
        })
})