import { getFileParts } from "utils/file";
import request from "./request";
import useRequest, { Config } from "./swr";

export const useVouchers = (
  email: string,
  config?: Config<{ data: CodeByEmail[] }>
) =>
  useRequest<{ data: CodeByEmail[] }>(
    { method: "GET", url: `voucher/${email}/getCodeByEmails/` },
    config
  );

export const useDynamicVouchers = (
  email: string,
  config?: Config<{ unredeemed: DynamicCode[]; redeemed: string[] }>
) =>
  useRequest<{ unredeemed: DynamicCode[]; redeemed: string[] }>(
    { method: "GET", url: `voucher/getDynamicVoucher/${email}/` },
    config
  );

export const useVoucher = (voucherID: number, config?: Config<Voucher>) =>
  useRequest<Voucher>({ method: "GET", url: `voucher/${voucherID}` }, config);

export const getNumCodes = (
  id: string,
) => {
    return request.get(`voucher/${id}/getNumCodes/`).then(res => res.data);
  }

export const createVoucher = (
  data: Partial<PostAdminVoucher>,
  files: AdminVoucherFiles = {}
) => {
  const formData = new FormData();
  Object.entries(data).forEach(([field, value]) => {
    formData.append(field, value.toString());
  });

  const { image } = files;
  if (image) {
    const imageFile = getFileParts(image);
    if (imageFile) formData.append("image", imageFile, imageFile.name);
  }

  return request.post("/voucher/", formData);
};

export const editVoucher = (
  uuid: string,
  data: Partial<PostAdminVoucher>,
  files: AdminVoucherFiles = {}
) => {
  const formData = new FormData();
  Object.entries(data).forEach(([field, value]) => {
    formData.append(field, value.toString());
  });

  const { image } = files;
  if (image) {
    const imageFile = getFileParts(image);
    if (imageFile) formData.append("image", imageFile, imageFile.name);
  }

  return request.patch(`/voucher/${uuid}`, formData);
};

export const uploadCodeList = (
  uuid: string,
  files: Omit<AdminVoucherFiles, "image" | "email_list"> = {}
) => {
  const formData = new FormData();
  formData.append("uuid", uuid);

  const { code_list } = files;

  const codeListFile = getFileParts(code_list!);
  if (codeListFile)
    formData.append("code_list", codeListFile, codeListFile.name);

  return request.post("voucher/code-list", formData);
};

export const uploadEmailList = (
  uuid: string,
  files: Omit<AdminVoucherFiles, "image" | "code_list"> = {}
) => {
  const formData = new FormData();
  formData.append("uuid", uuid);

  const { email_list } = files;

  const emailListFile = getFileParts(email_list!);
  if (emailListFile)
    formData.append("email_list", emailListFile, emailListFile.name);

  request.post("voucher/email-list", formData);
};

export const uploadManualCodes = (uuid: string, data: CodeEmailInput[]) => {
  const formData = new FormData();

  formData.append("uuid", uuid);
  data.forEach(({ key, value }) => {
    formData.append(key, value.toString());
  });

  return request.post("voucher/codes/manual", formData);
};

export const redeemVoucher = (data: Partial<RedeemableVoucher>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([field, value]) => {
    formData.append(field, value.toString());
  });
  return request.post("voucher/assignCodes/", formData);
};
