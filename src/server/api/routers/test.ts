import { createTRPCRouter, publicProcedure } from "../trpc";

const testRouter = createTRPCRouter({
  testing: publicProcedure.query(() => {
    return "hello, i am tester";
  }),
});

export default testRouter;
