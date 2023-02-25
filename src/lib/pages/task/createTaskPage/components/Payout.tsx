import {
  Badge,
  Card,
  CardBody,
  Flex,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { FormikProps } from "formik";
import type { CreateQuestInput } from "..";

function Payout({ formik }: { formik: FormikProps<CreateQuestInput> }) {
  const rewardAmount = formik.values.reward.amount;

  return (
    <Card variant="outline">
      <CardBody>
        <Stack>
          <Flex gap={2}>
            {formik.values.isDeposit ? (
              <Badge fontSize="lg" variant="outline" colorScheme="green">
                Deposited
              </Badge>
            ) : (
              <>
                {(rewardAmount > 0 && (
                  <Text color="gray.800" fontSize="lg">
                    You have to deposit {rewardAmount} CANTO to the smart
                    contract
                  </Text>
                )) || (
                  <>
                    <Text>Please enter a reward amount</Text>
                  </>
                )}
              </>
            )}
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default Payout;
