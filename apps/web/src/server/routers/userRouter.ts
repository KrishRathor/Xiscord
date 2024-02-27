import jwt from 'jsonwebtoken';
import { HttpStatusCode } from './../statusCode';
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const secret = 'Se3rEt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust the salt rounds as per your requirement
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
}

export const userRouter = router({
    signup: publicProcedure
        .input(z.object({
            username: z.string(),
            email: z.string(),
            password: z.string()
        }))
        .mutation(async opts => {
            const { username, email, password } = opts.input;

            const hashedPassword = await hashPassword(password)

            try {
                const user = await prisma.user.findFirst({
                    where: {
                        email: email
                    }
                })
    
                if (user) {
                    return {
                        code: HttpStatusCode.BadRequest,
                        message: 'User already present',
                        user: user
                    }
                }

                const createUser = await prisma.user.create({
                    data: {
                        email: email,
                        username: username,
                        password: hashedPassword
                    }
                });

                return {
                    code: HttpStatusCode.Created,
                    message: 'Created New User',
                    user: createUser
                }

            } catch (err) {
                console.error(err);
            } finally {
                await prisma.$disconnect();
            }

        }),
    login: publicProcedure
        .input(z.object({
            email: z.string(),
            password: z.string() 
        }))
        .mutation(async opts => {
            const { email, password } = opts.input;

            try {
                const user = await prisma.user.findFirst({
                    where: {
                        email: email
                    }
                });

                if (!user) {
                    return {
                        code: HttpStatusCode.NotFound,
                        message: 'User Not Found',
                        user: user,
                        token: null
                    }
                }

                const passwordMatched = await comparePasswords(password, user.password);

                if (!passwordMatched) {
                    return {
                        code: HttpStatusCode.BadRequest,
                        message: 'Incorrect password',
                        user: null,
                        token: null
                    }
                }

                const payload = {
                    email: user.email,
                    username: user.username,
                    user: null,
                    token: null
                }
                const token = jwt.sign(payload, 'secret');
                return {
                    code: HttpStatusCode.Accepted,
                    message: 'User and password matched',
                    user: null,
                    token: token
                }

            } catch (err) {
                console.log(err);
            } finally {
                await prisma.$disconnect();
            }

        }),
    me: publicProcedure
        .use(isLoggedIn)
        .mutation(async opts => {
            return {};
        })
})
