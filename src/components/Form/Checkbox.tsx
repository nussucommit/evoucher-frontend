import React from "react";
import { useField } from "formik";
import { useCheckbox } from "@chakra-ui/react";
import { Checkbox as BaseCheckbox, CheckboxProps } from "@commitUI/index";

type Props = Omit<CheckboxProps, "error"> & {
  name: string;
};

export const Checkbox = ({ name, id, ...props }: Props) => {
  const [field, meta] = useField(name);
  const { touched, error } = meta;
  const {
    state: { isChecked },
  } = useCheckbox({ isChecked: field.value });

  return (
    <BaseCheckbox
      id={name}
      isChecked={isChecked}
      error={touched && error ? error : ""}
      {...field}
      {...props}
    />
  );
};
