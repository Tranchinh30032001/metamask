import { TRPCError } from "@trpc/server";
import moment from "moment";
import { publicMiddleware, publicProcedure } from "./../trpc";
import { env } from "../../../env/client.mjs";

export const isAuth = publicMiddleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.isLoggedIn) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to access this resource",
    });
  }

  const expiredIn = moment.duration(
    env.NEXT_PUBLIC_SESSION_EXPIRED_IN_DAYS,
    "days"
  );
  if (moment(ctx.session.user.timestamp).add(expiredIn).isBefore(moment())) {
    ctx.session.user = undefined;
    ctx.session.loginNonce = undefined;
    await ctx.session.save();

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Your session has expired",
    });
  }

  return next();
});

export const protectedProcedure = publicProcedure.use(isAuth);
