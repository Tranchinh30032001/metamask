import { Card, CardBody, Flex, Heading, Spacer } from "@chakra-ui/react";
import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import AppButton from "../../../../components/AppButton";

export function QuestCard({
  title,
  children,
  onDeleteClick,
}: {
  title: string;
  onDeleteClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card variant="filled" bgColor="white" borderColor="black" borderWidth={2}>
      <CardBody>
        <Flex justifyContent="space-between">
          <Heading size="md">{title}</Heading>

          {onDeleteClick && (
            <AppButton onClick={onDeleteClick}>
              <FaTimesCircle size={24} />
            </AppButton>
          )}
        </Flex>
        <Spacer p={1} />

        {children}
      </CardBody>
    </Card>
  );
}
