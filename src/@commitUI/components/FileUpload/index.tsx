import React, { useCallback, useEffect, useState } from "react"
import { useDropzone, FileWithPath } from "react-dropzone"
import cx from "classnames"

import { Text } from "../Text"
import { Button } from "../Button"

import styles from "./FileUpload.module.css"

export type Props = {
  label?: string
  text?: string
  file?: string
  setFile: (base64?: string) => void
  className?: string
  type?: "image" | "csv" | "pdf"
  error?: string
}

const ACCEPTED = {
  image: "image/jpeg, image/png",
  csv:
    ".csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values",
  pdf: ".pdf",
}

export const FileUpload = ({
  label,
  text,
  file,
  setFile,
  type,
  error,
  className,
}: Props) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>()
  const onDropFile = useCallback((acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file: FileWithPath) => {
      const reader = new FileReader()
      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")
      reader.onload = () => {
        const result = reader.result as string
        console.log(result)
        setFile(result)
      }
      reader.readAsDataURL(file)
    })
  }, [])
  const onDropImage = useCallback((acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file: FileWithPath) => {
      const reader = new FileReader()
      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")
      reader.onload = () => {
        const result = reader.result as string
        setPreview(result)
        setFile(result)
      }
      reader.readAsDataURL(file)
    })
  }, [])

  useEffect(() => {
    // If already has image
    if (text?.includes("https")) {
      setPreview(text)
    }
  }, [text])

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: type === "image" ? onDropImage : onDropFile,
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

  const hasFile = acceptedFiles.length || file

  return (
    <div className={styles.container}>
      <Text className={styles.label}>{label}</Text>
      <div {...getRootProps({ className: cn })}>
        {!hasFile && !preview && (
          <Text className={styles.info}>
            Click here or drag your file to upload!
          </Text>
        )}
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview as string} alt="preview" />
        ) : (
          <Text>{acceptedFiles[0]?.name}</Text>
        )}
        {/* <div>{data && <img src={`data:image/jpeg;base64,${data}`} />}</div> */}
        {acceptedFiles.length || preview ? (
          <Button type="text" onClick={removeFile} className={styles.remove}>
            <Text className={styles.removeText}>Remove</Text>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
