import React, { useCallback, useState } from "react"
import {
  Alert as ChakraAlert,
  AlertIcon,
  AlertProps as ChakraAlertProps,
  CloseButton,
} from "@chakra-ui/react"

import { Text } from "../Text"

import cx from "classnames"

import styles from "./Alert.module.css"

export type AlertProps = Omit<ChakraAlertProps, "variant"> & {
  hasIcon?: boolean
  canClose?: boolean
  className?: string
  message: string
}

export const Alert = ({
  status,
  message,
  hasIcon = true,
  canClose = false,
  className,
  ...alertProps
}: AlertProps) => {
  const cn = cx(styles.card, className)
  // Since the initial state of isOp
  const [isOpen, setIsOpen] = useState(true)
  const onToggle = useCallback(() => setIsOpen(!isOpen), [isOpen])

  if (!isOpen) return null

  return (
    <ChakraAlert
      {...alertProps}
      status={status}
      alignItems="flex-start"
      className={cn}
    >
      {hasIcon && <AlertIcon marginTop={0.5} />}
      <Text>{message}</Text>
      {canClose && (
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          onClick={onToggle}
        />
      )}
    </ChakraAlert>
  )
}
