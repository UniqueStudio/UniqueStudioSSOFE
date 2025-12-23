import { Gender } from '@/views/user/editInfo/type';
import request from '../_request';

export async function getAllUsers(group: string) {
  const res = await request<getAllUsersItemT[]>({
    url: `/v1/user/${group}`,
    method: 'GET',
  });
  return res;
}

export type getAllUsersItemT = {
  CreatedAt: string;
  UpdatedAt: string;
  UID: string;
  Phone: string;
  Email: string;
  Password: string;
  ForceTOTP: boolean;
  TOTPSharedKey: string;
  Name: string;
  JoinTime: string;
  AvatarURL: string;
  Gender: Gender;
  Groups: string[];
  LarkID: string;
};
