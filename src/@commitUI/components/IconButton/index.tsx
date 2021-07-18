import React from "react"
import {
  Tooltip,
  IconButton as ChakraIconButton,
  IconButtonProps,
} from "@chakra-ui/react"

type Props = Omit<IconButtonProps, "aria-label"> & {
  label?: string
}

export const IconButton = ({
  onClick,
  isDisabled,
  icon,
  backgroundColor,
  label = "",
  ...props
}: Props) => {
  return (
    <Tooltip label={label}>
      <ChakraIconButton
        {...props}
        onClick={onClick}
        isDisabled={isDisabled}
        icon={icon}
        backgroundColor={backgroundColor}
        aria-label={label}
      />
    </Tooltip>
  )
}
