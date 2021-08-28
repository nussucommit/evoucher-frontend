import React from "react"
import { useField } from "formik"
import { TextArea as BaseTextArea, TextAreaProps } from "@commitUI/index"

type Props = TextAreaProps & {
  name: string
}

export const TextArea = ({ name, id, ...props }: Props) => {
  const [field, meta] = useField(name)
  const { touched, error } = meta

  return (
    <BaseTextArea
      id={name}
      error={touched && error ? error : ""}
      {...field}
      {...props}
    />
  )
}
