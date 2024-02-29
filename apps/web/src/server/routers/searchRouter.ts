import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "../statusCode";

const prisma = new PrismaClient();

export const searchRouter = router({
  getResultByQuery: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .use(isLoggedIn)
    .mutation(async (opts) => {
      const { query } = opts.input;

      try {
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { email: { contains: query, mode: "insensitive" } },
              { username: { contains: query, mode: "insensitive" } },
            ],
          },
        });

        return {
          code: HttpStatusCode.OK,
          message: "users found",
          users: users,
          query: query,
        };
      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect();
      }
    }),
});
