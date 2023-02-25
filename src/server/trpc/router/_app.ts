import { authRouter } from "./auth";
import { router } from "../trpc";
import { communityRouter } from "./community";
import { questRouter } from "./quest";

export const appRouter = router({
  community: communityRouter,
  task: questRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
