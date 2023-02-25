import z from "zod";

const followSchema = z.object({
  type: z.literal("twitterFollow"),
  userName: z.string(),
});
const retweetSchema = z.object({
  type: z.literal("twitterRetweet"),
  url: z
    .string()
    .url()
    .refine((data) => {
      return data.startsWith("https://twitter.com");
    }),
});
const likeSchema = z.object({
  type: z.literal("twitterLike"),
  url: z
    .string()
    .refine((data) => data.match(/https:\/\/twitter.com\/\w+\/status\/\d+/)),
});
const hashtagSchema = z.object({
  type: z.literal("twitterHashtag"),
  text: z.string().refine((data) => {
    // text must be startWith #, and separated by ',', for example: #test,#test2,#hithere
    return data.split(",").every((text) => text.startsWith("#"));
  }),
});
const discordJoin = z.object({
  type: z.literal("discordJoin"),
  url: z.string().url(),
});

export const questCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  no_endtime: z.boolean(),
  entries: z
    .array(
      z.object({
        data: z.discriminatedUnion("type", [
          followSchema,
          retweetSchema,
          likeSchema,
          hashtagSchema,
          discordJoin,
        ]),
      })
    )
    .min(1),
  reward: z.object({
    type: z.enum(["token"]),
    amount: z.coerce.number(),
    numberOfWinners: z.coerce.number(),
  }),
  communtiyIds: z.array(z.coerce.bigint()).min(1),
});
