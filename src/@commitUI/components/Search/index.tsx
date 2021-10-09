import { InputHTMLAttributes } from "react";
import cx from "classnames";
import { Search2Icon, SearchIcon } from "@chakra-ui/icons";

import { Text } from "../Text";

import styles from "./Search.module.css";
import { Color } from "@commitUI/constants/theme";

interface ExtendedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Search = ({
  value,
  label,
  error,
  id,
  // To-do: add additional styling for disabled state (make it more visible that it is disabled)
  disabled,
  className,
  type = "text",
  ...rest
}: ExtendedInputProps) => {
  const cn = cx(styles.container, className);

  return (
    <div className={cn}>
      <SearchIcon
        w={5}
        h={5}
        color={Color.grayLight}
        className={styles.searchIcon}
      />
      <input
        {...rest}
        value={value}
        type={type}
        id={id as string}
        disabled={disabled as boolean}
        className={Boolean(error) ? styles.inputError : undefined}
      />
    </div>
  );
};
