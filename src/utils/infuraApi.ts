import { ethers } from "ethers";
import { INFURA_API_URL, CONTRACT_ADDRESS, ABI } from "./constants";
import type { Contract } from "ethers";
import type { ContractDataType, UserDataType } from "./interface";
import { formatFromWei } from "./formatUtils";

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    const errorCode = (error as { code?: string })?.code;
    if (
      (errorCode === "SERVER_ERROR" ||
        errorCode === "429" ||
        errorCode === "NETWORK_ERROR") &&
      maxRetries > 0
    ) {
      console.warn(
        `Retrying... attempts left: ${maxRetries}, error: ${errorCode}`,
      );
      await new Promise((r) => setTimeout(r, delay));
      return withRetry(fn, maxRetries - 1, delay * 2);
    }
    throw error instanceof Error
      ? error
      : new Error(`Unknown error: ${String(error)}`);
  }
}
export const fetchContractData = async (): Promise<ContractDataType> => {
  try {
    if (!INFURA_API_URL || !CONTRACT_ADDRESS) {
      throw new Error("Missing INFURA_API_URL or CONTRACT_ADDRESS");
    }
    const provider = new ethers.JsonRpcProvider(INFURA_API_URL);
    const contract: Contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      provider,
    );
    const data = await withRetry(async () => {
      const [
        contractBalance,
        totalUsers,
        totalInvested,
        totalWithdrawn,
        totalReferralBonus,
        totalLeadershipBonus,
      ] = await contract.getPlatformStats();

      return {
        totalInvested: formatFromWei(totalInvested),
        totalUsers: Number(totalUsers),
        totalWithdrawn: formatFromWei(totalWithdrawn),
        totalLeadershipBonus: formatFromWei(totalLeadershipBonus),
        totalReferralBonus: formatFromWei(totalReferralBonus),
        contractBalance: formatFromWei(contractBalance),
      };
    });
    return data;
  } catch (error) {
    console.error("Error fetching contract data:", error);
    throw error;
  }
};

export const getReferralsCountByLevel = async (
  userAddress: string,
): Promise<string[]> => {
  try {
    const provider = new ethers.JsonRpcProvider(INFURA_API_URL);
    const contract: Contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      provider,
    );

    const referralCounts: string[] = [];

    for (let level = 1; level <= 15; level++) {
      try {
        const count = await contract.getReferralsCountByLevel(
          userAddress,
          level,
        );
        referralCounts.push(count.toString());
      } catch (error) {
        console.warn(
          `Error fetching referral count for level ${level}:`,
          error,
        );
        referralCounts.push("0");
      }
    }

    return referralCounts;
  } catch (error) {
    return Array(15).fill("0");
  }
};

export const fetchUserData = async (
  userAddress: string,
): Promise<UserDataType> => {
  try {
    if (!INFURA_API_URL || !CONTRACT_ADDRESS) {
      throw new Error("Missing INFURA_API_URL or CONTRACT_ADDRESS");
    }
    const provider = new ethers.JsonRpcProvider(INFURA_API_URL);
    const contract: Contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      provider,
    );
    const data = await withRetry(async () => {
      const [
        userTotalInvested,
        userTotalWithdrawn,
        activeInvestments,
        referralBonus,
        referralBonusWithdrawn,
        leadershipBonus,
        leadershipBonusWithdrawn,
        referrer,
        referralLevels,
        leadershipLevels,
        directReferrals,
      ] = await contract.getUserInfo(userAddress);
      const [
        planIds,
        amounts,
        startTimes,
        lastClaimTimes,
        totalClaimeds,
        actives,
        pendingRewards,
      ] = await contract.getUserInvestments(userAddress);
      const actualReferralCounts = await getReferralsCountByLevel(userAddress);
      const safeLeadershipLevels = Array.from(leadershipLevels).map(
        (level: any) => level.toString(),
      );
      return {
        userTotalInvested: formatFromWei(userTotalInvested),
        userTotalWithdrawn: formatFromWei(userTotalWithdrawn),
        activeInvestments: activeInvestments.toString(),
        referralBonus: formatFromWei(referralBonus),
        referralBonusWithdrawn: formatFromWei(referralBonusWithdrawn),
        leadershipBonus: formatFromWei(leadershipBonus),
        leadershipBonusWithdrawn: formatFromWei(leadershipBonusWithdrawn),
        referrer,
        referralLevels: actualReferralCounts,
        referralLevelsAmounts: referralLevels,
        leadershipLevels: safeLeadershipLevels,
        directReferrals: directReferrals.toString(),
        planIds: planIds.map((id: any) => id.toString()),
        amounts: amounts.map((amt: any) => formatFromWei(amt)),
        startTimes: startTimes.map((time: any) => time.toString()),
        lastClaimTimes: lastClaimTimes.map((time: any) => time.toString()),
        totalClaimeds: totalClaimeds.map((amt: any) => formatFromWei(amt)),
        actives: actives,
        pendingRewards: pendingRewards.map((amt: any) => formatFromWei(amt)),
      };
    });
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
