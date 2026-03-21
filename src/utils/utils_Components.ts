import { getWalletSymbol } from "./ProviderUtils.ts";
const symbol = getWalletSymbol();

export interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  iconClass: string;
}

interface ContractData {
  contractBalance?: number;
  depositAmount?: number;
  totalUsers?: number;
  refRewardsAmount?: number;
}

export const getCardDataContractData = (data: ContractData): CardData[] => [
  {
    id: "contractBalance",
    title: "Contract Balance",
    value: parseFloat((data?.contractBalance ?? 0.0).toFixed(4)),
    unit: ` ${symbol}`,
    iconClass: "bi bi-currency-dollar fs-3 ",
  },
  {
    id: "deposited",
    title: "Deposit",
    value: parseFloat((data?.depositAmount ?? 0.0).toFixed(4)),
    unit: ` ${symbol}`,
    iconClass: "bi bi-wallet2 fs-3 ",
  },
  {
    id: "users",
    title: "Users",
    value: data?.totalUsers ?? 0,
    unit: "",
    iconClass: "bi bi-person-circle fs-3 ",
  },

  {
    id: "refRewards",
    title: "Ref Rewards",
    value: parseFloat((data?.refRewardsAmount ?? 0.0).toFixed(4)),
    unit: ` ${symbol}`,
    iconClass: "bi bi-gift fs-3 ",
  },
];
