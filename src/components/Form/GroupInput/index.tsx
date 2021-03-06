import { useState } from "react";
import { useField, FieldArray } from "formik";
import { InputProps, Button, Text } from "commit-design";
import cx from "classnames";

import { Input } from "..";

import styles from "./GroupInput.module.scss";

type Props = InputProps & {
  name: string;
  keyLabel?: string;
  valueLabel?: string;
  disabled?: boolean;
};

export const GroupInput = ({
  name,
  id,
  label,
  keyLabel,
  valueLabel,
  className,
  disabled,
  ...props
}: Props) => {
  const [field] = useField(name);
  const { value } = field;

  const container = cx(styles.container, className, {
    [styles.disabled]: disabled,
  });

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <div className={container}>
          <Text className={styles.label}>{label}</Text>
          {value.map((row: { key: string; value: string }, index: number) => (
            <>
              <div key={index} className={styles.inputContainer}>
                <Input
                  className={styles.halfInput}
                  name={`${name}[${index}].key`}
                  label={keyLabel}
                />
                <Input
                  className={styles.halfInput}
                  name={`${name}[${index}].value`}
                  label={valueLabel}
                />

                <Button
                  className={styles.remove}
                  type="danger"
                  onClick={
                    index > 0
                      ? () => arrayHelpers.remove(index)
                      : () =>
                          arrayHelpers.replace(index, { key: "", value: "" })
                  }
                >
                  Remove
                </Button>
              </div>
            </>
          ))}

          <Button
            className={styles.add}
            onClick={() => arrayHelpers.push({ key: "", value: "" })}
          >
            Add
          </Button>
        </div>
      )}
    />
  );
};
