import { Box } from "@chakra-ui/react";
import React from "react";
import styles from "./EmptyLayout.module.css";

type Props = {
  children: React.ReactNode;
};

function EmptyLayout({ children }: Props) {
  return (
    <Box className={styles.container} overflowY="scroll">
      {children}
    </Box>
  );
}

export default EmptyLayout;
