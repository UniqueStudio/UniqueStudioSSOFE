import { Gender } from '@/views/user/editInfo/type';
import { HttpRes } from '@/constants/httpMsg/_httpResTemplate';
import { HR_BASE_URL } from '@/constants';
import request from '../_request';

// 仅能查询 member 和 admin
export async function getAllUsersInGroup(group: string) {
  const res = await request<userInfoT[]>({
    url: `/v1/user/${group}`,
    method: 'GET',
  });
  return res;
}

export type userInfoT = {
  UID: string;
  Phone: string;
  Email: string;
  Name: string;
  JoinTime: string;
};

export async function getLatestRecruitment(): Promise<LatestRecruitmentResponse> {
  const res: LatestRecruitmentResponse = await request(
    {
      url: '/recruitments/pending',
      method: 'GET',
    },
    HR_BASE_URL,
  );
  return res;
}

export async function getAllUsers(group: string): Promise<userInfoT[]> {
  const data1 = await getAllUsersInGroup(group);
  const data2 = await getLatestRecruitment();
  const users = data1.data;
  users.push(
    ...data2.data
      .applications!.filter((v) => v.rejected !== false && v.group === group)
      .map((v) => ({
        Email: v.user_detail!.email,
        JoinTime: data2.data.name,
        Name: v.user_detail!.name,
        Phone: v.user_detail!.phone,
        UID: v.user_detail!.uid,
      }))!,
  );
  return users;
}

export type LatestRecruitmentResponse = HttpRes<Recruitment>;

export interface Recruitment {
  uid: string;
  created_at: TimeString;
  updated_at: TimeString;
  name: string;
  beginning: TimeString;
  deadline: TimeString;
  end: TimeString;
  applications?: Application[];
}

type TimeString = string;

export interface Application {
  uid: string;
  created_at: TimeString;
  updated_at: TimeString;
  grade: string;
  institute: string;
  major: string;
  rank: string;
  group: Group;
  intro: string;
  is_quick: false;
  is_project_c: false;
  referrer: string;
  resume: string;
  answer: string;
  abandoned: false;
  rejected: false;
  step: Step;
  candidate_id: string;
  recruitment_id: string;
  interview_allocations_group?: Interview;
  interview_allocations_team?: Interview;
  user_detail?: UserDetail;
  interview_selections?: Interview[];
  comments?: Comment[];
}

export enum Group {
  Web = 'web',
  Lab = 'lab',
  AI = 'ai',
  Game = 'game',
  Mobile = 'mobile',
  Design = 'design',
  PM = 'pm',
  Unique = 'unique', // for team interview
  Blockchain = 'blockchain',
}

export enum Step {
  SignUp = 'SignUp', // 报名
  WrittenTest = 'WrittenTest', // 笔试
  GroupTimeSelection = 'GroupTimeSelection', // 组面时间选择
  GroupInterview = 'GroupInterview', // 组面
  OnlineGroupInterview = 'OnlineGroupInterview', // 在线组面
  StressTest = 'StressTest', // 熬测
  TeamTimeSelection = 'TeamTimeSelection', // 群面时间选择
  TeamInterview = 'TeamInterview', // 团体面试(群面)
  OnlineTeamInterview = 'OnlineTeamInterview', // 在线群面
  Pass = 'Pass', // 通过
}

export interface Interview {
  uid: string;
  created_at: TimeString;
  updated_at: TimeString;
  date: TimeString;
  period: Period;
  start: TimeString;
  end: TimeString;
  name: Group;
  slot_number: number;
  recruitment_id: string;
}

export enum Period {
  Morning = 'morning',
  Afternoon = 'afternoon',
  Evening = 'evening',
}

interface UserDetail {
  uid: string;
  phone: string;
  email: string;
  name: string;
  avatar_url: string;
  gender: Gender;
  join_time: string;
  groups: Group[];
  lark_union_id: string;
  qq_account?: string;
}
