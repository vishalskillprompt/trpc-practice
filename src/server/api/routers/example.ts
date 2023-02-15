import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { Example } from "@prisma/client";

const ee = new EventEmitter();

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  onMessageSend: publicProcedure.subscription(() => {
    return observable<Example[]>((emit) => {
      const onMessage = (data: Example[]) => {
        console.log("data received:", data);
        emit.next(data);
      };

      ee.on("message_sent", onMessage);

      return () => {
        ee.off("message_sent", onMessage);
      };
    });
  }),

  sendMessage: publicProcedure
    .input(z.object({ value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dataAdded = await ctx.prisma.example.create({
        data: {
          value: input.value,
        },
      });

      const allData = await ctx.prisma.example.findMany();

      console.log("dataAdded", dataAdded);
      ee.emit("message_sent", allData);

      return allData;
    }),

  deleteMessage: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const dataDeleted = await ctx.prisma.example.delete({
        where: {
          id: input.id,
        },
      });
      return "Data deleted";
    }),

  updateMessage: publicProcedure
    .input(z.object({ id: z.number(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const dataUpdated = await ctx.prisma.example.update({
        where: {
          id: input.id,
        },
        data: {
          value: input.value,
        },
      });
      return dataUpdated;
    }),
});
