import React from "react"
import { useField } from "formik"

import { Select as BaseSelect, SelectProps } from "@commitUI/index"

type Props = Omit<SelectProps, "onBlur" | "onChange"> & {
  name: string
}

export const Select = ({ name, label, ...props }: Props) => {
  const [field, meta, helper] = useField(name)
  const { onBlur } = field
  const { setValue } = helper
  const { error, touched } = meta

  return (
    <BaseSelect
      {...props}
      {...field}
      id={name}
      label={label}
      error={touched && error ? error : ""}
      onChange={(option: Option) => setValue(option)}
      onBlur={onBlur}
    />
  )
}
