import {
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  Text,
  FormLabel,
  Input,
  Spacer,
  SimpleGrid,
  Img,
} from "@chakra-ui/react";
import { Select, chakraComponents } from "chakra-react-select";
import type { FormikProps } from "formik";
import React from "react";
import type { CreateQuestInput } from "..";

function Reward({ formik }: { formik: FormikProps<CreateQuestInput> }) {
  return (
    <Card variant="outline">
      <CardBody>
        <SimpleGrid columns={2} spacing={2}>
          <FormControl
            isInvalid={
              formik.touched.reward?.amount && formik.errors.reward?.amount
                ? true
                : false
            }
            isDisabled={formik.isSubmitting}
            isRequired
          >
            <FormLabel htmlFor="rewardAmount">Total Reward</FormLabel>
            <Input
              id="rewardAmount"
              {...formik.getFieldProps("reward.amount")}
            />
            {formik.errors.reward?.amount ? (
              <FormErrorMessage>{formik.errors.reward.amount}</FormErrorMessage>
            ) : null}
          </FormControl>

          {/* Token: USDT, BNB */}
          <FormControl isDisabled={formik.isSubmitting}>
            <FormLabel htmlFor="rewardToken">Token</FormLabel>
            <Select
              id="rewardToken"
              options={[
                {
                  label: "USDT",
                  value: "USDT",
                  icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
                },
                {
                  label: "CANTO",
                  value: "CANTO",
                  icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/21516.png",
                },
              ]}
              components={{
                Option: ({ data, ...props }) => (
                  <chakraComponents.Option
                    {...props}
                    data={{
                      label: data.label,
                      value: data.value,
                      icon: data.icon,
                    }}
                  >
                    <Img src={data.icon} w={6} h={6} mr={2} />
                    <Text fontWeight={"bold"}>{data.label}</Text>
                  </chakraComponents.Option>
                ),
              }}
            />
          </FormControl>
        </SimpleGrid>

        <Spacer p={2} />

        {/* Number of winner questers */}
        <FormControl
          isInvalid={!!formik.errors.reward?.numberOfWinners}
          isDisabled={formik.isSubmitting}
        >
          <FormLabel htmlFor="rewardNumberOfWinners">
            Number of winners
          </FormLabel>
          <Input
            id="rewardNumberOfWinners"
            {...formik.getFieldProps("reward.numberOfWinners")}
          />
          {formik.errors.reward?.numberOfWinners ? (
            <FormErrorMessage>
              {formik.errors.reward.numberOfWinners}
            </FormErrorMessage>
          ) : null}
        </FormControl>

        <Spacer p={2} />

        {/* Calculate amount per winner */}
        <FormControl>
          <FormLabel htmlFor="amountPerWinner">Amount per winner</FormLabel>
          <Input
            id="amountPerWinner"
            disabled
            value={
              formik.values.reward.amount / formik.values.reward.numberOfWinners
            }
          />
          {formik.errors.reward?.numberOfWinners ? (
            <FormErrorMessage>
              {formik.errors.reward.numberOfWinners}
            </FormErrorMessage>
          ) : null}
        </FormControl>
      </CardBody>
    </Card>
  );
}

export default Reward;
