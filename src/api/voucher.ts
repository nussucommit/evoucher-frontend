import { getFileParts } from "utils/file"
import request from "./request"
import useRequest, { Config } from "./swr"

export const useVouchers = (
  email: string,
  config?: Config<{ data: CodeByEmail[] }>
) =>
  useRequest<{ data: CodeByEmail[] }>(
    { method: "GET", url: `voucher/${email}/getCodeByEmails/` },
    config
  )

export const useVoucher = (voucherID: number, config?: Config<Voucher>) =>
  useRequest<Voucher>({ method: "GET", url: `voucher/${voucherID}` }, config)

export const createVoucher = (
  data: Partial<PostAdminVoucher>,
  files: AdminVoucherFiles = {}
) => {
  const formData = new FormData()
  Object.entries(data).forEach(([field, value]) => {
    formData.append(field, value.toString())
  })

  const { image } = files
  const file = getFileParts(image!)
  if (file) formData.append("image", file, file.name)

  request.post("/voucher/", formData)
}
