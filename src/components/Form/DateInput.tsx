import React from "react"
import { useField } from "formik"

import { DateInput as BaseDateInput, DateInputProps } from "@commitUI/index"

type Props = Omit<DateInputProps, "onBlur" | "onChange"> & {
  name: string
}

export const DateInput = ({ name, label, ...props }: Props) => {
  const [field, meta, helper] = useField(name)
  const { onBlur } = field
  const { setValue } = helper
  const { error, touched } = meta

  console.log(field.value)
  return (
    <BaseDateInput
      {...props}
      {...field}
      id={name}
      label={label}
      error={touched && error ? error : ""}
      onChange={(date: Date | [Date | null, Date | null] | null) => setValue(date)}
      onBlur={onBlur}
    />
  )
}
