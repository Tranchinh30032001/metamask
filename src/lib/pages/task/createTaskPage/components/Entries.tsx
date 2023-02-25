import { QuestCard } from "./QuestCard";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Spacer,
} from "@chakra-ui/react";
import type { FormikProps } from "formik";
import { motion } from "framer-motion";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import type { CreateQuestInput } from "..";
import QuestItem from "../../../../components/QuestItem";

function Entries({ formik }: { formik: FormikProps<CreateQuestInput> }) {
  const extenionList = [
    {
      name: "Twitter Follow",
      icon: <FaTwitter />,
      type: "twitterFollow",
      backgroundColor: "twitter.400",
    },
    {
      name: "Twitter Retweet",
      icon: <FaTwitter />,
      type: "twitterRetweet",
      backgroundColor: "twitter.400",
    },
    {
      name: "Twitter Like",
      icon: <FaTwitter />,
      type: "twitterLike",
      backgroundColor: "twitter.400",
    },
    {
      name: "Twitter Hashtag",
      icon: <FaTwitter />,
      type: "twitterHashtag",
      backgroundColor: "twitter.400",
    },
    {
      name: "Discord Join",
      icon: <FaDiscord />,
      type: "discordJoin",
      backgroundColor: "#7289da",
    },
  ];

  const getTitle = (type: typeof extenionList[0]["type"]) => {
    switch (type) {
      case "twitterFollow":
        return "Twitter Follow";
      case "twitterRetweet":
        return "Twitter Retweet";
      case "twitterLike":
        return "Twitter Like";
      case "twitterHashtag":
        return "Twitter Hashtag";
      case "discordJoin":
        return "Discord Join";
    }

    return (extenionList[0] as any).name;
  };

  const renderExtension = (extension: typeof extenionList[0]) => {
    return (
      <QuestItem
        onClick={() => {
          const entries = formik.values.entries;

          switch (extension.type) {
            case "twitterFollow": {
              entries.push({
                data: {
                  type: "twitterFollow",
                  userName: "",
                },
              });
              break;
            }
            case "twitterRetweet": {
              entries.push({
                data: {
                  type: "twitterRetweet",
                  url: "",
                },
              });
              break;
            }
            case "twitterLike": {
              entries.push({
                data: {
                  type: "twitterLike",
                  url: "",
                },
              });
              break;
            }
            case "twitterHashtag": {
              entries.push({
                data: {
                  type: "twitterHashtag",
                  text: "",
                },
              });
              break;
            }
            case "discordJoin": {
              entries.push({
                data: {
                  type: "discordJoin",
                  url: "",
                },
              });
              break;
            }
          }

          formik.setFieldValue("tasks", [...entries]);
        }}
        title={extension.name}
        icon={extension.icon}
        backgroundColor={extension.backgroundColor}
      />
    );
  };

  const onDeleteClick = (index: number) => {
    const entries = formik.values.entries;
    entries.splice(index, 1);
    formik.setFieldValue("tasks", [...entries]);
  };

  return (
    <Box>
      <Card variant="outline" bgColor="white" borderWidth={2} mx={6}>
        <CardBody>
          <Flex wrap="wrap" gap={3}>
            {extenionList.map(renderExtension)}
          </Flex>
        </CardBody>
      </Card>

      <Spacer p={2} />

      <Flex flexDir="column" wrap="wrap" gap={2}>
        {formik.values.entries.map((entry, index) => {
          const { type } = entry.data;
          const error = formik.errors.entries?.[index];

          // Force typescript type
          if (typeof error === "string") return null;

          return (
            <Box
              key={index}
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
            >
              {type === "twitterLike" ? (
                <QuestCard
                  title={getTitle(entry.data.type)}
                  onDeleteClick={() => onDeleteClick(index)}
                >
                  <FormControl
                    isInvalid={
                      (formik.touched.entries?.[index]?.data as any)?.url &&
                      (error?.data as any)?.url
                        ? true
                        : false
                    }
                    isDisabled={formik.isSubmitting}
                    isRequired
                  >
                    <FormLabel htmlFor="url">URL</FormLabel>
                    <Input
                      id="url"
                      {...formik.getFieldProps(`entries.${index}.data.url`)}
                    />
                    {(formik.touched.entries?.[index]?.data as any)?.url &&
                    (error?.data as any)?.url ? (
                      <FormErrorMessage>
                        {formik.errors.description}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </QuestCard>
              ) : type === "twitterRetweet" ? (
                <QuestCard
                  title={getTitle(entry.data.type)}
                  onDeleteClick={() => onDeleteClick(index)}
                >
                  {/* url */}
                  <FormControl
                    isInvalid={
                      (formik.touched.entries?.[index]?.data as any)?.url &&
                      (error?.data as any)?.url
                        ? true
                        : false
                    }
                    isDisabled={formik.isSubmitting}
                    isRequired
                  >
                    <FormLabel htmlFor="url">URL</FormLabel>
                    <Input
                      id="url"
                      {...formik.getFieldProps(`entries.${index}.data.url`)}
                      placeholder="https://twitter.com/intent/tweet"
                      type="url"
                      isDisabled={formik.isSubmitting}
                    />
                    {(formik.touched.entries?.[index]?.data as any)?.url &&
                    (error?.data as any)?.url ? (
                      <FormErrorMessage>
                        {formik.errors.description}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </QuestCard>
              ) : type === "twitterHashtag" ? (
                <QuestCard
                  title={getTitle(entry.data.type)}
                  onDeleteClick={() => onDeleteClick(index)}
                >
                  {/* text */}
                  <FormControl
                    isInvalid={
                      (formik.touched.entries?.[index]?.data as any)?.text &&
                      (error?.data as any)?.text
                        ? true
                        : false
                    }
                    isDisabled={formik.isSubmitting}
                    isRequired
                  >
                    <FormLabel htmlFor="text">
                      Hashtags (separated by comma)
                    </FormLabel>
                    <Input
                      id="text"
                      {...formik.getFieldProps(`entries.${index}.data.text`)}
                      placeholder="#twitter, #retweet, #like"
                    />
                    {(formik.touched.entries?.[index]?.data as any)?.text &&
                    (error?.data as any)?.text ? (
                      <FormErrorMessage>
                        {formik.errors.description}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </QuestCard>
              ) : type === "twitterFollow" ? (
                <QuestCard
                  title={getTitle(entry.data.type)}
                  onDeleteClick={() => onDeleteClick(index)}
                >
                  {/* userName */}
                  <FormControl
                    isInvalid={
                      (formik.touched.entries?.[index]?.data as any)
                        ?.userName && (error?.data as any)?.userName
                        ? true
                        : false
                    }
                    isDisabled={formik.isSubmitting}
                    isRequired
                  >
                    <FormLabel htmlFor="userName">Username</FormLabel>
                    <InputGroup>
                      {/* eslint-disable-next-line react/no-children-prop */}
                      <InputLeftAddon children="https://twitter.com/" />
                      <Input
                        id="userName"
                        {...formik.getFieldProps(
                          `entries.${index}.data.userName`
                        )}
                        placeholder="twitter"
                      />
                    </InputGroup>
                    {(formik.touched.entries?.[index]?.data as any)?.userName &&
                    (error?.data as any)?.userName ? (
                      <FormErrorMessage>
                        {formik.errors.description}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </QuestCard>
              ) : type === "discordJoin" ? (
                <QuestCard
                  title={getTitle(entry.data.type)}
                  onDeleteClick={() => onDeleteClick(index)}
                >
                  {/* inviteCode */}
                  <FormControl
                    isInvalid={
                      (formik.touched.entries?.[index]?.data as any)
                        ?.inviteCode && (error?.data as any)?.inviteCode
                        ? true
                        : false
                    }
                    isDisabled={formik.isSubmitting}
                    isRequired
                  >
                    <FormLabel htmlFor="inviteCode">Invite Code</FormLabel>
                    <Input
                      id="inviteCode"
                      {...formik.getFieldProps(
                        `entries.${index}.data.inviteCode`
                      )}
                      placeholder="https://discord.gg/inviteCode"
                      type="url"
                      isDisabled={formik.isSubmitting}
                    />
                    {(formik.touched.entries?.[index]?.data as any)
                      ?.inviteCode && (error?.data as any)?.inviteCode ? (
                      <FormErrorMessage>
                        {formik.errors.description}
                      </FormErrorMessage>
                    ) : null}
                  </FormControl>
                </QuestCard>
              ) : (
                <></>
              )}
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

export default Entries;
