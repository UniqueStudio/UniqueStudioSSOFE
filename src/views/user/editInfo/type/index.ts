import { InfoData } from '@/constants/httpMsg/register/InfoStatusMsg';

export const enum Gender {
  male = 1,
  female = 2,
  other = 3,
}

export interface EditFormInfo {
  name: string;
  gender: Gender | null;
  password: string;
  email: string;
}

export interface UserInfo {
  name: InfoData['name'];
  gender: InfoData['gender'];
  phoneNumber: InfoData['phone'];
  email: InfoData['email'];
  roles: InfoData['roles'];
  groups: InfoData['groups'];
}

export interface PermissionFormInfo {
  phone: string;
  joinTime: string;
  group: string;
  role: string;
}

export interface EditStore {
  editFormInfo: EditFormInfo;
  userInfo: UserInfo;
  permissionFormInfo: PermissionFormInfo;
}
