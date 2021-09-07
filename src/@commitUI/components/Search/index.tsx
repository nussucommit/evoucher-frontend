import React, { InputHTMLAttributes } from "react"
import cx from "classnames"

import { Text } from "../Text"

import styles from "./Search.module.css"

interface ExtendedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  label?: string
  error?: string
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
  const cn = cx(
    styles.container,
    {
      [styles.containerError]: Boolean(error),
    },
    className
  )

  const cnLabel = cx({
    [styles.filled]: value !== "",
    [styles.labelError]: Boolean(error),
  })

  return (
    <div className={cn} {...rest}>
      <input
        {...rest}
        value={value}
        type={type}
        id={id as string}
        disabled={disabled as boolean}
        className={Boolean(error) ? styles.inputError : undefined}
      />
      <label className={cnLabel}>{label}</label>
      {Boolean(error) && (
        <Text size="xs" semibold className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  )
}
