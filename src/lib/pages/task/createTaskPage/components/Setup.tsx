import {
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Spacer,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import {
  AsyncCreatableSelect,
  AsyncSelect,
  CreatableSelect,
  Select,
} from "chakra-react-select";

import type { FormikProps } from "formik";
import { useMemo } from "react";
import type { CreateQuestInput } from "..";
import { trpc } from "../../../../core/utils/trpc";

const MAX_LIMIT = 999_999_999;

function Setup({ formik }: { formik: FormikProps<CreateQuestInput> }) {
  const { data } = trpc.community.getAll.useQuery({
    limit: MAX_LIMIT,
    offset: 0,
  });

  const options = useMemo(
    () =>
      data?.communities.map((v) => ({
        label: v.name,
        value: v.id.toString(),
      })),
    [data]
  );

  return (
    <Card variant="outline">
      <CardBody>
        <FormControl
          isInvalid={formik.touched.title && formik.errors.title ? true : false}
          isDisabled={formik.isSubmitting}
          isRequired
        >
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" {...formik.getFieldProps("title")} />
          {formik.touched.title && formik.errors.title ? (
            <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
          ) : null}
        </FormControl>

        <Spacer p={3} />

        <FormControl
          isInvalid={
            formik.touched.description && formik.errors.description
              ? true
              : false
          }
          isDisabled={formik.isSubmitting}
          isRequired
        >
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea id="description" {...formik.getFieldProps("description")} />
          {formik.touched.description && formik.errors.description ? (
            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
          ) : null}
        </FormControl>

        <Spacer p={3} />

        <SimpleGrid columns={2} spacing={3}>
          {/* Start time */}
          <FormControl
            isInvalid={formik.touched.start && !!formik.errors.start}
            isDisabled={formik.isSubmitting}
            isRequired
          >
            <FormLabel htmlFor="start">Start date</FormLabel>
            <Input type="datetime-local" {...formik.getFieldProps("start")} />
            {formik.touched.start && formik.errors.start ? (
              <FormErrorMessage>
                {formik.errors.start as string}
              </FormErrorMessage>
            ) : null}
          </FormControl>
          {/* End time */}
          <FormControl
            isInvalid={formik.touched.end && !!formik.errors.end}
            isDisabled={formik.isSubmitting}
            isRequired
          >
            <FormLabel htmlFor="end">End date</FormLabel>
            <Input
              id="end"
              type="datetime-local"
              {...formik.getFieldProps("end")}
            />
            {formik.touched.end && formik.errors.end ? (
              <FormErrorMessage>{formik.errors.end as string}</FormErrorMessage>
            ) : null}
          </FormControl>
        </SimpleGrid>

        <Spacer p={3} />
        {/* no end time? */}
        <FormControl
          isInvalid={!!formik.errors.no_endtime}
          isRequired
          isDisabled={formik.isSubmitting}
        >
          <FormLabel htmlFor="no_endtime">No end time?</FormLabel>
          <Switch
            id="no_end_time"
            {...formik.getFieldProps("no_endtime")}
            size="lg"
            colorScheme="green"
          />
          {formik.touched.no_endtime && formik.errors.no_endtime ? (
            <FormErrorMessage>
              {formik.errors.no_endtime as string}
            </FormErrorMessage>
          ) : null}
        </FormControl>

        <Spacer p={3} />

        <SimpleGrid columns={2} spacing={3}>
          <FormControl
            isInvalid={
              !!formik.touched.communtiyIds && !!formik.errors.communtiyIds
            }
            isDisabled={formik.isSubmitting}
            isRequired
          >
            <FormLabel htmlFor="image">Community</FormLabel>{" "}
            <Select
              isMulti
              options={[{ options: options, label: "Community" }]}
              onChange={(values) => {
                formik.setFieldValue(
                  "communtiyIds",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  values.map((v) => (v as any).value)
                );
              }}
            />
            {formik.touched.communtiyIds && formik.errors.communtiyIds ? (
              <FormErrorMessage>{formik.errors.communtiyIds}</FormErrorMessage>
            ) : null}{" "}
          </FormControl>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
}

export default Setup;
