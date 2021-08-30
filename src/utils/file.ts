import { nanoid } from "nanoid"

const dataToFile = (dataUrl: string, filename: string = nanoid()) => {
  const extension = dataUrl.split("/")[1].split(";")[0]
  filename = [filename, extension].join(".")
  dataUrl.replace("file://", "")
  const arr = dataUrl.split(",")
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new File([u8arr], filename, { type: mime })
}

export const getFileParts = (uri: string): File => {
  const file = dataToFile(uri)
  return file
}

export const isSameFileUrl = (url1?: string | null, url2?: string | null) =>
  url1 && url2 && url1.split("?")[0] === url2.split("?")[0]

export const isFileGreaterThanTenMB = (dataUrl: string) => {
  const arr = dataUrl.split(",")
  const decoded = atob(arr[1].split(";")[0])
  const sizeInMB = decoded.length / 1024 / 1024
  return sizeInMB > 10
}
