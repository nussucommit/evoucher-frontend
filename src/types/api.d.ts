// Types for APIs

interface Token {
  access: string;
  refresh: string;
}

interface Voucher {
  uuid: string;
  posted_date: string;
  available_date: string;
  expiry_date: string;
  name: string;
  organization: string;
  voucher_type: string;
  description: string;
  counter: number;
  image: string;
  code_uploaded: boolean;
}

interface CodeByEmail {
  id: number;
  voucher_id: number;
  code_id: number;
  email_id: number;
}

interface CodeEmailInput {
  key: string;
  value: string;
}

interface DynamicCode {
  id: string;
  uuid: number;
  code_id: number;
}

interface NoCodeVoucher {
  uuid: number;
}

interface RedeemableVoucher {
  id?: string;
  email: string;
}

type AdminVoucherFiles = {
  image?: string;
  code_list?: string;
  email_list?: string;
};
interface AdminVoucher extends AdminVoucherFiles {
  uuid: string;
  posted_date: string;
  available_date: string;
  expiry_date: string;
  name: string;
  voucher_type: string;
  description?: string;
  eligible_faculties: string;
  counter: number;
  image: string;
  code_uploaded?: boolean;
  organization: string;
}

type PostAdminVoucher = Omit<AdminVoucher, "uuid" | AdminVoucherFiles>;

interface OrganizationVouchers {
  count: number;
  next: string;
  previous: string;
  results: AdminVoucher[];
}

type Option = {
  value: string | number;
  label: string;
};

type VoucherType = "Default" | "No code" | "Dinamically allocated";

interface User {
  username: string;
}

interface Organization {
  name: string;
  is_first_time_login: boolean;
}
