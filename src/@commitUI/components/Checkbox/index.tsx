import React from "react";
import { Checkbox as ChakraCheckbox, CheckboxProps } from "@chakra-ui/react";

import { Text } from "../Text";

import styles from "./Checkbox.module.css";

export type Props = CheckboxProps & {
  label?: string;
  error?: string;
};

export const Checkbox = ({ label = "", error, className, ...props }: Props) => {
  return (
    <div className={className}>
      <ChakraCheckbox {...props}>
        <Text>{label}</Text>
      </ChakraCheckbox>
      {Boolean(error) && (
        <Text size="xs" semibold className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  );
};
