import {
  Box,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { memo } from "react";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import AppButton from "../../../components/AppButton";
import { trpc } from "../../../core/utils/trpc";

const createSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  slug: z.string({ required_error: "Slug is required" }),
});

const CreateCommunity = () => {
  const utils = trpc.useContext();
  const router = useRouter();
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      toast.promise(mutateAsync({ name: values.name, slug: values.slug }), {
        loading: {
          title: "Creating community...",
          description: "Creating community...",
        },
        success: (data) => {
          return {
            title: `Community ${data.community?.name} created!`,
            description: "Community created!",
            status: "success",
            duration: 5000,
            isClosable: true,
          };
        },
        error: (err) => {
          return {
            title: "Error",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            actions: [
              {
                title: "Dismiss",
                onClick: () => {
                  toast.closeAll();
                },
              },
            ],
          };
        },
      });

      setSubmitting(false);
    },
    validationSchema: toFormikValidationSchema(createSchema),
  });
  const { mutateAsync } = trpc.community.createOne.useMutation({
    onSuccess: () => {
      utils.community.getAll.invalidate();

      // router.push(`/community/${formik.values.slug}`);
      router.push(`/community`);
    },
  });

  return (
    <Card
      variant="outline"
      borderColor="black"
      borderWidth={2}
      w="full"
      maxW="5xl"
      mx="auto"
      bgColor="white"
    >
      <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <Heading size="md">Create Community</Heading>
          <Spacer p={3} />
          <FormControl
            isInvalid={formik.touched.name && formik.errors.name ? true : false}
            isDisabled={formik.isSubmitting}
            isRequired
          >
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input {...formik.getFieldProps("name")} />
            {formik.touched.name && formik.errors.name ? (
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            ) : null}
          </FormControl>

          <Spacer p={2} />

          <FormControl
            isInvalid={formik.touched.slug && formik.errors.slug ? true : false}
            isRequired
            isDisabled={formik.isSubmitting}
          >
            <FormLabel htmlFor="slug">Community URL</FormLabel>
            <InputGroup>
              <InputLeftAddon
                /* eslint-disable-next-line react/no-children-prop */
                children={`${window.location.origin}/community/`
                  .replace("https://", "")
                  .replace("http://", "")}
                {...formik.getFieldProps("slug")}
              />
              <Input {...formik.getFieldProps("slug")} />
            </InputGroup>
            {formik.touched.slug && formik.errors.slug ? (
              <FormErrorMessage>{formik.errors.slug}</FormErrorMessage>
            ) : null}
          </FormControl>

          <Spacer p={4} />

          <Box w="56">
            <AppButton colorScheme="messenger" px={16} type="submit">
              Create
            </AppButton>
          </Box>
        </form>
      </CardBody>
    </Card>
  );
};

export default memo(CreateCommunity);
