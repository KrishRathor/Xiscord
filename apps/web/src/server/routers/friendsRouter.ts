import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { PrismaClient, User } from "@prisma/client";
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

                const firstUser = await prisma.user.findFirst({
                    where: {
                        email: userId,
                    }
                })

                const secondUser = await prisma.user.findFirst({
                    where: {
                        email: email,
                    }
                })

                if (!firstUser || !secondUser) {
                    return {
                        code: HttpStatusCode.NotFound,
                        message: 'Not found',
                        friend: null
                    }
                }

                const preFriends = await prisma.friend.findFirst({
                    where: {
                        userId: firstUser.username,
                        friendId: secondUser.username
                    }
                });

                const preReverseFriends = await prisma.friend.findFirst({
                    where: {
                        userId: secondUser.username,
                        friendId: firstUser.username
                    }
                });

                if (preFriends || preReverseFriends) {
                    return {
                        code: HttpStatusCode.BadRequest,
                        message: 'already exist',
                        friend: null
                    }
                }

                const friend = await prisma.friend.create({
                    data: {
                        userId: firstUser.username,
                        friendId: secondUser.username
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
    getAllFriends: publicProcedure
        .use(isLoggedIn)
        .mutation(async opts => {
            const { userId } = opts.ctx;

            try {

                if (!userId) {
                    return {
                        code: HttpStatusCode.Unauthorized,
                        message: "Unauthorized",
                        friends: null
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
                        message: 'User not found',
                        friends: null
                    }
                }

                const friends = await prisma.friend.findMany({
                    where: {
                        userId: user.username
                    }
                });

                const friends2 = await prisma.friend.findMany({
                    where: {
                        friendId: user.username
                    }
                });

                console.log(friends, friends2);

                const f: User[] = [];

                friends.map(async friend => {
                    const user = await prisma.user.findFirst({
                        where: {
                            username: friend.friendId
                        }
                    })
                    user && f.push(user);
                })

                friends2.map(async friend => {
                    const user = await prisma.user.findFirst({
                        where: {
                            username: friend.userId
                        }
                    })
                    user && f.push(user);
                })

                return {
                    code: HttpStatusCode.OK,
                    message: 'friends found',
                    friends: f
                }

            } catch (err) {
                console.log(err);
            } finally {
                await prisma.$disconnect();
            }

        })
})