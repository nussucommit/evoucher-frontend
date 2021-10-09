import React, { InputHTMLAttributes } from "react";
import cx from "classnames";

import { Text } from "../Text";

import styles from "./TextArea.module.css";

export interface ExtendedTextAreaProps
  extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, "placeholder"> {
  label?: string;
  error?: string;
}

export const TextArea = ({
  value,
  label,
  error,
  id,
  // To-do: add additional styling for disabled state (make it more visible that it is disabled)
  disabled,
  className,
  ...rest
}: ExtendedTextAreaProps) => {
  const cn = cx(
    styles.container,
    {
      [styles.containerError]: Boolean(error),
    },
    className
  );

  const cnLabel = cx({
    [styles.filled]: value !== "",
    [styles.labelError]: Boolean(error),
  });

  return (
    <div className={cn}>
      <>
        <textarea
          {...rest}
          value={value}
          rows={3}
          id={id as string}
          // disabled={disabled as boolean}
          readOnly={false}
          className={Boolean(error) ? styles.inputError : undefined}
        />
        <label className={cnLabel}>{label}</label>
        {Boolean(error) && (
          <Text size="xs" semibold className={styles.error}>
            {error}
          </Text>
        )}
      </>
    </div>
  );
};
