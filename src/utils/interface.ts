export interface ContractDataType {
  contractBalance?: string;
  totalInvested: string;
  totalUsers: number;
  totalWithdrawn: string;
  totalLeadershipBonus: string;
  totalReferralBonus?: string;
}

export interface UserDataType {
  userTotalInvested: string;
  userTotalWithdrawn: string;
  activeInvestments: string;
  referralBonus: string;
  referralBonusWithdrawn: string;
  leadershipBonus: string;
  leadershipBonusWithdrawn: string;
  referrer: string;
  referralLevels: string[];
  leadershipLevels: string[];
  directReferrals: string;
  planIds: string[];
  amounts: string[];
  startTimes: string[];
  lastClaimTimes: string[];
  totalClaimeds: string[];
  actives: boolean[];
  pendingRewards: string[];
}

export interface LeadershipLevel {
  name: string;
  percentage: string;
  description: string;
}
