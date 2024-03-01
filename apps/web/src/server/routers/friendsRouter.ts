import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "../statusCode";

const prisma = new PrismaClient();

export const friendsRouter = router({
    addFriend: publicProcedure
        .input(z.object({
            email: z.string()
        }))
        .use(isLoggedIn)
        .mutation(async opts => {
            const { email } = opts.input;
            const { userId } = opts.ctx;

            try {

                if (email === userId || !userId) {
                    return {
                        code: HttpStatusCode.InternalServerError,
                        message: "Internal server error",
                        friend: null
                    }
                };

                const friend = await prisma.friend.create({
                    data: {
                        userId: userId,
                        friendId: email
                    }
                })

                return {
                    code: HttpStatusCode.Created,
                    message: "Added Friends",
                    friend: friend
                }

            } catch (err) {
                console.log(err);
            } finally {
                await prisma.$disconnect();
            }

        }),
})