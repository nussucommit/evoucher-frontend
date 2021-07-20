import React, { useCallback } from "react"
import { useDropzone, FileWithPath } from "react-dropzone"
import cx from "classnames"

import { Text } from "../Text"
import { Button } from "../Button"

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

  const removeFile = () => {
    acceptedFiles.splice(0, 1) // remove the file from the array
    setFile("")
  }

  return (
    <>
      <div {...getRootProps({ className: cn })}>
        <input {...getInputProps()} />
        {acceptedFiles.length ? (
          <Text>{acceptedFiles[0].name}</Text>
        ) : (
          <>
            {text.includes("https") && <img src={text} />}
            <Text className={styles.text}>{text}</Text>
          </>
        )}
        {/* <div>{data && <img src={`data:image/jpeg;base64,${data}`} />}</div> */}
      </div>
      {acceptedFiles.length ? (
        <Button type="text" onClick={removeFile}>
          Remove
        </Button>
      ) : null}
    </>
  )
}
