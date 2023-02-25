import {
  Center,
  Heading,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useCallback, useEffect } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { questCreateSchema } from "../../../../server/trpc/validation/quest";
import type { RouterInputs } from "../../../core/utils/trpc";
import { trpc } from "../../../core/utils/trpc";
import AppButton from "../../../components/AppButton";
import AppContainer from "../../../components/AppContainer";
import { Entries, Payout, Reward, Setup } from "./components";
import { ethers } from "ethers";
import { env } from "../../../../env/client.mjs";
import { CantoQuest__factory } from "../../../core/typechain";

export type CreateQuestInput = RouterInputs["task"]["createQuest"] & {
  isDeposit: boolean;
};

function CreateQuestPage() {
  const toast = useToast();
  const { mutateAsync } = trpc.task.createQuest.useMutation();
  const formik = useFormik<CreateQuestInput>({
    initialValues: {
      title: "",
      reward: { amount: 0, type: "token", numberOfWinners: 1 },
      description: "",
      communtiyIds: [],
      end: new Date(),
      start: new Date(),
      entries: [],
      no_endtime: false,
      isDeposit: false,
    },
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);

      toast.promise(mutateAsync(formik.values), {
        loading: {
          title: "Creating quest...",
        },
        success: (data) => {
          setSubmitting(false);
          return {
            title: "Quest created!",
            description: `Quest created with id: ${data.id}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          };
        },
        error: (error) => {
          setSubmitting(false);
          return {
            title: "Error",
            description: error.message,
            status: "error",
          };
        },
      });
      setSubmitting(false);
    },
    validationSchema: toFormikValidationSchema(questCreateSchema),
  });

  const tabs = [
    {
      name: "1. Setup",
      tab: Setup,
    },
    {
      name: "2. Entries",
      tab: Entries,
    },
    {
      name: "3. Reward",
      tab: Reward,
    },
    {
      name: "4. Deposit Payout",
      tab: Payout,
    },
  ];

  const callDeposit = useCallback(async () => {
    if (formik.values.isDeposit || formik.values.reward.amount <= 0) {
      return;
    }

    const address = env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const signer = new ethers.providers.Web3Provider(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.ethereum as any
    ).getSigner();
    const contract = CantoQuest__factory.connect(address, signer);

    try {
      const tx = await contract.deposit({
        value: ethers.utils.parseEther(formik.values.reward.amount.toString()),
      });

      toast.promise(tx.wait(), {
        loading: {
          title: "Depositing...",
          description: "Please wait...",
        },
        success: (tx) => {
          formik.setFieldValue("isDeposit", true);
          return {
            title: "Deposited",
            description: JSON.stringify(tx.events?.[0]?.args, null, 2),
          };
        },
        error: (err) => {
          return {
            title: "Error",
            description: err.message,
          };
        },
      });
    } catch (err) {
      toast({
        title: "Error",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: (err as any)?.message || "Unknown error",
        status: "error",
      });
    }
  }, [formik, toast]);

  useEffect(() => {
    if (!formik.isSubmitting) {
      //  toast if there is error
      if (formik.errors && Object.keys(formik.errors).length > 0) {
        const humanReadableErrors = Object.keys(formik.errors).map((key) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return `${key}: ${JSON.stringify(formik.errors[key], null, 2)}`;
        });

        toast.closeAll();
        toast({
          title: "Error",
          description: humanReadableErrors.join(", "),
          status: "error",
          duration: 9000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.isSubmitting]);

  return (
    <AppContainer>
      <Heading size="lg">Create quest</Heading>
      <Spacer p={1} />

      <Tabs variant="soft-rounded" colorScheme="green">
        <TabList display="flex" flexWrap="wrap">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              onClick={() => {
                if (tabs[index]?.tab === Payout) {
                  callDeposit();
                }
              }}
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>

        <Spacer p={2} />

        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel p={0} key={index}>
              <tab.tab formik={formik} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <Spacer p={3} />
      <Center>
        <AppButton outerBox={{ w: "56" }} onClick={() => formik.handleSubmit()}>
          Create quest
        </AppButton>
      </Center>
    </AppContainer>
  );
}

export default CreateQuestPage;
