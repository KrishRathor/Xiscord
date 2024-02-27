import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const emailRouter = router({
  sendEmail: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const { email } = opts.input;
        console.log(process.env.EMAIL);

        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const min = 1000;
        const max = 9999;
        const code = Math.floor(Math.random() * (max - min + 1)) + min;

        const info = await transporter.sendMail({
          from: "From <Xiscord>", // sender address
          to: email, // list of receivers
          subject: "Verification Code", // Subject line
          html: `<h1>Enter this code: </h1><p>${code}</p>`, // html body
        });

        return {
          message: info,
          code: code
        };
      } catch (err) {
        console.log(err);
      }
    }),
    verifyEmail: publicProcedure
        .input(z.object({
            correct: z.boolean(),
            email: z.string()
        }))
        .mutation(async opts => {
            const { correct, email } = opts.input;

            try {
                
                if (correct) {
                    const verified = await prisma.user.update({
                        where: { email: email },
                        data: { emailVerified: true },
                    })
                    return {
                        message: 'Email verifed',
                        data: verified
                    }
                }

            } catch (err) {
                console.log(err);
            } finally {
                await prisma.$disconnect();
            }

        })
});
