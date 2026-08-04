export type SkillId = 'new_episodes' | 'revive_old_episodes';

export interface SkillInfo {
  id: SkillId;
  number: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
  badgeColor: string;
  iconName: string;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  subscribers: string;
  videoCount: number;
}

export interface Agent {
  id: string;
  name: string;
  channelId: string;
  channelName: string;
  channelHandle: string;
  channelAvatarUrl: string;
  skillId: SkillId;
  active: boolean; // status light: true = green 🟢, false = red 🔴
  hiredAt: string; // ISO string date
  operatingUntil: string; // ISO string date (always 5th of current/next month when deactivated)
  nextBillingDate: string; // ISO string date (always 5th of next billing cycle)
  monthlyCost: number; // 19.00
  initialProratedPaid: number; // calculated at hiring time
  cutsGeneratedCount: number;
  lastActive: string;
}

export interface GeneratedCut {
  id: string;
  agentId: string;
  channelName: string;
  title: string;
  originalEpisode: string;
  skillUsed: SkillId;
  durationSeconds: number;
  viewsEstimated: string;
  createdAt: string;
  thumbnailUrl: string;
  youtubeUrl: string;
}

export interface ProrateCalculation {
  startDate: string;
  nextBillingDate: string;
  daysRemaining: number;
  totalDaysInCycle: number;
  fullMonthlyPrice: number;
  proratedPrice: number;
  dailyRate: number;
}
