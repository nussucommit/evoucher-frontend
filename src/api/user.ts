import useRequest, { Config } from "./swr";

export const useUser = (config?: Config<User>) =>
  useRequest<User>({ method: "GET", url: `user/me` }, config);
