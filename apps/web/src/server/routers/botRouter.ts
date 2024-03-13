import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const BotRouter = router({
    createBot: publicProcedure
        .input(z.object({
            botName: z.string()
        }))
        .use(isLoggedIn)
        .mutation(async opts => {
            const { botName } = opts.input;
            const { userId } = opts.ctx;

            try {

            } catch (err) {
                console.error(err);
            } finally {
                await prisma.$disconnect();
            }
        })
})