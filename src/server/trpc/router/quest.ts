import { QuestType } from "@prisma/client";
import { z } from "zod";
import { questCreateSchema } from "../validation/quest";
import { protectedProcedure } from "./../middlewares/auth";

import { publicProcedure, router } from "../trpc";

export const questRouter = router({
  createQuest: protectedProcedure
    .input(questCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        title,
        description,
        start,
        end,
        no_endtime,
        entries,
        // eligibility,
      } = input;

      const entriesData = await ctx.prisma.$transaction(
        entries.map((entry) => {
          switch (entry.data.type) {
            case "twitterFollow": {
              return ctx.prisma.entry.create({
                data: {
                  type: QuestType.Follow,
                  TwitterFollow: {
                    create: {
                      username: entry.data.userName,
                    },
                  },
                },
              });
              break;
            }
            case "twitterRetweet": {
              return ctx.prisma.entry.create({
                data: {
                  type: QuestType.Retweet,
                  TwitterRetweet: {
                    create: {
                      url: entry.data.url,
                    },
                  },
                },
              });
              break;
            }
            case "twitterHashtag": {
              return ctx.prisma.entry.create({
                data: {
                  type: QuestType.Hashtag,
                  TwitterHashtag: {
                    create: {
                      // TODO: Fix this
                      text: entry.data.text,
                      url: entry.data.text,
                    },
                  },
                },
              });
              break;
            }
            case "twitterLike": {
              return ctx.prisma.entry.create({
                data: {
                  type: QuestType.Like,
                  TwitterLike: {
                    create: {
                      url: entry.data.url,
                    },
                  },
                },
              });
              break;
            }
            default: {
              return ctx.prisma.entry.create({
                data: {
                  type: QuestType.Follow,
                },
              });
            }
          }
        })
      );

      const quest = await ctx.prisma.quest.create({
        data: {
          title,
          description,
          startTime: start,
          endTime: end,
          noEndTime: no_endtime,
          Entries: {
            connect: entriesData.map((entry) => {
              return {
                id: entry.id,
              };
            }),
          },
        },
        select: {
          id: true,
        },
      });

      // update quest
      await ctx.prisma.quest.update({
        where: {
          id: quest.id,
        },
        data: {
          Community_Quest: {
            create: input.communtiyIds.map((communityId) => {
              return {
                communityId,
              };
            }),
          },
        },
      });

      return quest;
    }),
  getQuests: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, offset } = input;
      const quests = await ctx.prisma.quest.findMany({
        take: limit,
        skip: offset,
      });
      return quests;
    }),
  getQuest: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const quest = await ctx.prisma.quest.findUnique({
      where: {
        id: input,
      },
    });
    return quest;
  }),
});
