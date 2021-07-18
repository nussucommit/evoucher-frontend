import React from "react"
import cx from "classnames"

import styles from "./Text.module.css"

export type Props = {
  block?: boolean
  centered?: boolean
  children?: React.ReactNode
  className?: string
  ellipsize?: boolean
  noLeading?: boolean
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  bold?: boolean
  semibold?: boolean
  type?:
    | "black"
    | "danger"
    | "gray"
    | "light"
    | "lighter"
    | "lightest"
    | "primary"
    | "success"
    | "warning"
    | "white"
  uppercase?: boolean
  span?: boolean
}

export const Text = (props: Props) => {
  const {
    centered,
    children,
    className,
    ellipsize,
    noLeading,
    size,
    bold,
    semibold,
    type,
    uppercase,
    span,
  } = props
  const cn = cx(
    styles.text,
    {
      [styles.centered]: centered,
      [styles.semibold]: semibold,
      [styles.bold]: bold,
      [styles.noLeading]: noLeading,
      [styles.ellipsize]: ellipsize,
      [styles.uppercase]: uppercase,
      [styles.xs]: size === "xs",
      [styles.sm]: size === "sm",
      [styles.md]: size === "md",
      [styles.lg]: size === "lg",
      [styles.xl]: size === "xl",
      [styles.gray]: type === "gray",
      [styles.light]: type === "light",
      [styles.lighter]: type === "lighter",
      [styles.lightest]: type === "lightest",
      [styles.black]: type === "black",
      [styles.white]: type === "white",
      [styles.primary]: type === "primary",
      [styles.success]: type === "success",
      [styles.danger]: type === "danger",
      [styles.warning]: type === "warning",
    },
    className
  )
  if (span) return <span className={cn}>{children}</span>
  return <p className={cn}>{children}</p>
}
