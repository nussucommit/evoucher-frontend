import React from "react"
import { useField } from "formik"

import { Select as BaseSelect, SelectProps } from "@commitUI/index"

type Props = Omit<SelectProps, "onBlur" | "onChange"> & {
  name: string
}

export const Select = ({ name, label, onChange: onChangeProps, ...props }: Props) => {
  const [field, meta, helper] = useField(name)
  const { onBlur } = field
  const { setValue } = helper
  const { error, touched } = meta
  const onChange = (option: Option) => {
    onChangeProps(option);
    setValue(option);
  }

  return (
    <BaseSelect
      {...props}
      {...field}
      id={name}
      label={label}
      error={touched && error ? error : ""}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}
