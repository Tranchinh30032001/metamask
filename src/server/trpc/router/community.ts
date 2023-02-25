import { protectedProcedure } from "./../middlewares/auth";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const communityRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        offset: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ input: { limit, offset }, ctx }) => {
      const where: Prisma.CommunityWhereInput = {};
      const rest = {
        skip: offset,
        take: limit,
      };

      const [communities, count] = await Promise.all([
        ctx.prisma.community.findMany({ where, ...rest }),
        ctx.prisma.community.count({ where }),
      ]);

      return {
        offset,
        limit,
        count,
        communities,
      };
    }),
  createOne: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
      })
    )
    .mutation(async ({ input: { name, slug }, ctx }) => {
      if (!ctx.session.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const community = await ctx.prisma.community
        .create({
          data: {
            name,
            slug,
            ownerId: BigInt(ctx.session.user.sqlid),
          },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((e: any) => {
          // unique contrains
          if (e.code === "P2002") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const field = (e?.meta?.target as any)?.[0];

            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `The ${field} is already taken.`,
            });
          }
        });

      return {
        community,
      };
    }),
  getOneBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input: { slug }, ctx }) => {
      const community = await ctx.prisma.community
        .findUnique({
          where: { slug },
          rejectOnNotFound: true,
          include: {
            Community_Quest: {
              include: {
                quest: {
                  include: {
                    Entries: {
                      include: {
                        TwitterFollow: true,
                        TwitterHashtag: true,
                        TwitterLike: true,
                        TwitterReply: true,
                        TwitterRetweet: true,
                      },
                    },
                  },
                },
              },
            },
            Owner: {
              select: {
                address: true,
              },
            },
          },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((e: any) => {
          // if not found
          console.log(e);
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
              throw new TRPCError({
                code: "NOT_FOUND",
              });
            }
          }

          return null;
        });

      return community;
    }),

  deleteOneBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .mutation(async ({ input: { slug }, ctx }) => {
      const community = await ctx.prisma.community
        .delete({
          where: { slug },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((e: any) => {
          // if not found
          console.log(e);
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
              throw new TRPCError({
                code: "NOT_FOUND",
              });
            }
          }

          return null;
        });

      return community;
    }),

  updateOneBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        avatarUrl: z.string().url().optional(),
      })
    )
    .mutation(
      async ({ input: { slug, name, description, avatarUrl }, ctx }) => {
        const sqlid = ctx.session.user?.sqlid;
        if (!sqlid) throw new TRPCError({ code: "UNAUTHORIZED" });

        const community = await ctx.prisma.community
          .updateMany({
            where: {
              AND: [{ slug }, { ownerId: BigInt(sqlid) }],
            },
            data: {
              name,
              description,
              avatarUrl,
            },
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((e: any) => {
            // if not found
            console.log(e);
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
              if (e.code === "P2025") {
                throw new TRPCError({
                  code: "NOT_FOUND",
                });
              }
            }

            return null;
          });

        return community;
      }
    ),
});
