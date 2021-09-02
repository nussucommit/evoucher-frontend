import request from "./request"
import useRequest, { Config } from "./swr"

export const useOrganization = (
  username?: string,
  config?: Config<Organization>
) =>
  useRequest<Organization>(
    {
      method: "GET",
      url: `organization/getorgbyuname/${username}`,
    },
    config
  )

export const useOrganizationVouchers = (
  params: {
    Organization?: string
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

export const updateOrganization = (
  name: string,
  data: Partial<Organization>
) => {
  request.patch(`organization/${name}`, data)
}
