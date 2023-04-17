export type TAuthResponse = {
  token: string;
  user: TUserProtected;
};

export type TUserProtected = {
  id: number;
  email: string;
  username: string;
  diskSpace: bigint;
  usedSpace: bigint;
  createdAt: string;
  updatedAt: string;
};
