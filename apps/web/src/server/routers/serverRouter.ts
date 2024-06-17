import { isLoggedIn } from './../middlewares/isLoggedIn';
import { ostring, string, z } from "zod";
import { publicProcedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";
import { HttpStatusCode } from "../statusCode";
import { publicDecrypt } from 'crypto';

const prisma = new PrismaClient();

export const serverRouter = router({
  createServer: publicProcedure
    .input(z.object({
      serverName: z.string(),
    }))
    .use(isLoggedIn)
    .mutation(async opts => {
      const { serverName } = opts.input;
      const { userId } = opts.ctx;

      try {

        const user = await prisma.user.findFirst({
          where: {
            email: userId
          }
        })

        if (!user) {
          return {
            code: HttpStatusCode.NotFound,
            message: 'account not exist',
            server: null
          }
        }

        const server = await prisma.server.findFirst({
          where: {
            serverName: serverName
          }
        })

        if (server) {
          return {
            code: HttpStatusCode.BadRequest,
            message: 'Server already exists',
            server: null
          }
        }

        const users = [user.username]
        console.log('here');

        const createServer = await prisma.server.create({
          data: {
            serverName: serverName,
            admin: user.email,
            users: users,
            textChannels: ['general', 'session-planning', 'off-topic']
          }
        });
        console.log('and here');

        await prisma.textChannels.create({
          data: {
            channelName: 'general',
            users: users,
            server: serverName
          }
        })
        await prisma.textChannels.create({
          data: {
            channelName: 'session-planning',
            users: users,
            server: serverName
          }
        })
        await prisma.textChannels.create({
          data: {
            channelName: 'off-topic',
            users: users,
            server: serverName
          }
        })
        console.log('and here also');

        return {
          code: HttpStatusCode.Created,
          message: 'Created New Server',
          server: createServer
        }

      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect()
      }
    }),
  joinServer: publicProcedure
    .input(z.object({
      serverName: z.string()
    }))
    .use(isLoggedIn)
    .mutation(async opts => {
      const { serverName } = opts.input;
      const { userId } = opts.ctx;

      try {

        if (!userId) {
          return {
            code: HttpStatusCode.Unauthorized,
            message: 'token not found or incorrect',
            server: null
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
            message: 'Not Joined',
            server: null
          }
        }

        const server = await prisma.server.findFirst({
          where: {
            serverName: serverName
          }
        })

        if (!server) {
          return {
            code: HttpStatusCode.NotFound,
            message: "Not Found",
            server: server
          }
        }

        const userExists = server.users.filter(usr => usr === user.username);

        if (userExists.length > 0) {
          return {
            code: HttpStatusCode.BadRequest,
            message: 'Already joined',
            server: server
          }
        }

        const users = [...server.users, user.username];

        const joinServer = await prisma.server.update({
          where: {
            serverName: serverName
          },
          data: {
            users: users
          }
        });

        const channels = server.textChannels;

        channels.map(async chnl => {
          const joinChannel = await prisma.textChannels.update({
            //@ts-ignore
            where: {
              AND: [
                { channelName: chnl },
                { server: serverName }
              ]
            },
            data: {
              users: users
            }
          })
        })

        return {
          code: HttpStatusCode.OK,
          message: 'server joined',
          server: joinServer
        }

      } catch (err) {
        console.log(err)
      } finally {
        await prisma.$disconnect()
      }

    }),
  getServerByServerName: publicProcedure
    .input(z.object({
      serverName: z.string(),
    }))
    .use(isLoggedIn)
    .mutation(async opts => {
      const { serverName } = opts.input;
      const { userId } = opts.ctx;

      try {
        const user = await prisma.user.findFirst({
          where: {
            email: userId
          }
        })

        if (!user) {
          return {
            code: HttpStatusCode.Unauthorized,
            message: 'unauthorized',
            server: null
          }
        }

        const server = await prisma.server.findFirst({
          where: {
            serverName: serverName
          }
        })

        return {
          code: HttpStatusCode.OK,
          message: 'Server Found',
          server: server
        }
      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect();
      }

    }),
  getAllServersByUser: publicProcedure
    .use(isLoggedIn)
    .mutation(async opts => {
      const { userId } = opts.ctx;

      try {

        const user = await prisma.user.findFirst({
          where: {
            email: userId
          }
        })

        if (!user) {
          return {
            code: HttpStatusCode.NotFound,
            message: 'user not registered',
            servers: null
          }
        }

        const servers = await prisma.server.findMany({
          where: {
            users: {
              has: user.username
            }
          }
        });

        return {
          code: HttpStatusCode.OK,
          message: 'all servers by users',
          servers: servers
        }

      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect();
      }

    }),
  createChannel: publicProcedure
    .input(z.object({
      channelName: z.string(),
      serverName: z.string()
    }))
    .use(isLoggedIn)
    .mutation(async opts => {
      // while creating a new channel add channel in textchannel model and also update channel's array in server model
      const { channelName, serverName } = opts.input;
      const { userId } = opts.ctx;

      try {

        const user = await prisma.user.findFirst({
          where: {
            email: userId
          }
        })

        if (!user) {
          return {
            code: HttpStatusCode.Unauthorized,
            message: 'user not regsiterd',
            channel: null
          }
        }

        const server = await prisma.server.findFirst({
          where: {
            serverName: serverName
          }
        })

        if (!server) {
          return {
            code: HttpStatusCode.NotFound,
            message: 'Server not found',
            channel: null
          }
        }

        if (server.admin !== userId) {
          return {
            code: HttpStatusCode.Unauthorized,
            message: 'only admin can create channel',
            channel: null
          }
        }

        const channels = [...server.textChannels, channelName];
        await prisma.server.update({
          where: {
            serverName: serverName
          },
          data: {
            textChannels: channels
          }
        })

        const createNewChannel = await prisma.textChannels.create({
          data: {
            channelName: channelName,
            users: server.users,
            server: serverName
          }
        })

        return {
          code: HttpStatusCode.Created,
          message: 'New Channel created',
          channel: createNewChannel
        }

      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect();
      }
    }),
  getConversationForAChannel: publicProcedure
    .input(z.object({
      channelName: z.string()
    }))
    .use(isLoggedIn)
    .mutation(async opts => {
      const { channelName } = opts.input;
      const { userId } = opts.ctx;

      try {

        const user = await prisma.user.findFirst({
          where: {
            email: userId,
          }
        })

        if (!user) {
          return {
            code: HttpStatusCode.NotFound,
            message: 'user not registered',
            conversation: null
          }
        }

        const channel = await prisma.textChannels.findFirst({
          where: {
            channelName: channelName
          }
        });

        if (!channel) {
          return {
            code: HttpStatusCode.NotFound,
            message: 'channel not fonud',
            conversation: null
          }
        }

        const conversation = await prisma.conversationMessage.findMany({
          where: {
            channelName: channelName
          }
        })

        return {
          code: HttpStatusCode.OK,
          message: 'conversation found',
          conversation: conversation
        }

      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect();
      }

    }),
  getChannel: publicProcedure
    .input(z.object({
      channelName: z.string(),
      serverName: z.string()
    }))
    .use(isLoggedIn)
    .mutation(async opts => {
      const { channelName, serverName } = opts.input;
      const { userId } = opts.ctx;

      try {
        const user = await prisma.user.findFirst({
          where: {
            email: userId
          }
        })

        if (!user) {
          return {
            code: HttpStatusCode.Unauthorized,
            message: 'no token',
            channel: null
          }
        }

        const channel = await prisma.textChannels.findFirst({
          where: {
            AND: [
              { channelName: channelName },
              { server: serverName }
            ]
          }
        })

        return {
          code: HttpStatusCode.OK,
          message: 'channel found',
          channel: channel
        }
      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect();
      }
    }),
  sendMessage: publicProcedure
    .input(z.object({
      content: z.string(),
      serverName: z.string(),
      channelName: z.string()
    }))
    .use(isLoggedIn)
    .mutation(async opts => {
      const { userId } = opts.ctx;
      const { content, serverName, channelName } = opts.input;

      try {
        const user = await prisma.user.findFirst({
          where: {
            email: userId
          }
        })

        if (!user) {
          return {
            code: HttpStatusCode.Unauthorized,
            message: 'no token',
            conversation: null
          }
        }

        const conv = await prisma.conversationMessage.create({
          data: {
            channelName: channelName,
            server: serverName,
            fromUser: user.username,
            content: content
          }
        })

        return {
          code: HttpStatusCode.Created,
          message: 'message sent',
          conversation: conv
        }
      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect();
      }
    }),
  getConversation: publicProcedure
    .input(z.object({
      serverName: z.string(),
      channelName: z.string()
    }))
    .use(isLoggedIn)
    .mutation(async opts => {
      const { userId } = opts.ctx;
      const { serverName, channelName } = opts.input;

      try {
        const user = await prisma.user.findFirst({
          where: {
            email: userId
          }
        })

        if (!user) {
          return {
            code: HttpStatusCode.Unauthorized,
            message: 'no token',
            conversation: null
          }
        }

        const conversations = await prisma.conversationMessage.findMany({
          where: {
            AND: [
              { server: serverName },
              { channelName: channelName }
            ]
          }
        })

        return {
          code: HttpStatusCode.OK,
          message: 'conversartions found',
          conversation: conversations
        }
      } catch (err) {
        console.log(err);
      } finally {
        await prisma.$disconnect();
      }

    }),
  addMemberToServer: publicProcedure
    .input(z.object({
      serverName: z.string(),
      username: z.string()
    }))
    .use(isLoggedIn)
    .mutation(async opts => {
      try {

        const { serverName, username } = opts.input;

        const user = await prisma.user.findFirst({
          where: {
            username
          }
        })

        if (!user) {
          return {
            code: HttpStatusCode.NotFound,
            message: 'not found',
            result: null
          }
        }

        const server = await prisma.server.findFirst({
          where: {
            serverName: serverName
          }
        })

        if (!server) {
          return {
            code: HttpStatusCode.NotFound,
            message: "Not Found",
            server: server
          }
        }

        if (server.admin !== opts.ctx.userId) {
          return {
            code: HttpStatusCode.Unauthorized,
            message: 'only admin can add members',
            result: null
          }
        }

        const userExists = server.users.filter(usr => usr === user.username);

        if (userExists.length > 0) {
          return {
            code: HttpStatusCode.BadRequest,
            message: 'Already joined',
            server: server
          }
        }

        const users = [...server.users, user.username];

        const joinServer = await prisma.server.update({
          where: {
            serverName: serverName
          },
          data: {
            users: users
          }
        });

        return {
          code: HttpStatusCode.OK,
          message: 'user added to server',
          result: joinServer
        }

      } catch (err) {
        console.log(err);
        return {
          code: HttpStatusCode.InternalServerError,
          message: "InternalServerError",
          result: null
        }
      } finally {
        await prisma.$disconnect();
      }
    })
})
