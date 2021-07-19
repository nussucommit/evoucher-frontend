import React, { useCallback } from "react"
import { useDropzone, FileWithPath } from "react-dropzone"
import cx from "classnames"

import { Text } from "../Text"

import styles from "./FileUpload.module.css"

export type Props = {
  text: string
  setFile: (base64?: string) => void
  className?: string
  type?: "image" | "csv" | "pdf"
  error?: string
}

const ACCEPTED = {
  image: "image/jpeg, image/png",
  csv: ".csv",
  pdf: ".pdf",
}

export const FileUpload = ({
  text,
  setFile,
  type,
  error,
  className,
}: Props) => {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file: FileWithPath) => {
      const reader = new FileReader()
      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.slice(result.indexOf(",") + 1)
        setFile(base64)
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: type ? ACCEPTED[type] : undefined,
  })

  const cn = cx(
    styles.dropzone,
    {
      [styles.active]: isDragActive,
      [styles.accept]: isDragAccept,
      [styles.reject]: isDragReject,
    },
    className
  )

  return (
    <div {...getRootProps({ className: cn })}>
      <input {...getInputProps()} />
      <Text>{text}</Text>
      {/* <div>{data && <img src={`data:image/jpeg;base64,${data}`} />}</div> */}
    </div>
  )
}
