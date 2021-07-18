import useRequest, { Config } from "./swr"

export const useOrganizationVouchers = (
  params: {
    Organization: string
    page?: string
    page_size?: string
  },
  config?: Config<OrganizationVouchers>
) =>
  useRequest<OrganizationVouchers>(
    {
      method: "GET",
      url: `voucher/?${new URLSearchParams(params).toString()}`,
    },
    config
  )
