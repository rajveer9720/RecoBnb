import ABI from "./abi.json";

export const INFURA_API_URL = import.meta.env.VITE_APP_INFURA_API_URL;
export const CONTRACT_ADDRESS =
  import.meta.env.VITE_APP_INFURA_CONTRACT_ADDRESS ||
  "0xaCa4FB645cdaa7fDEd05f64b5bb732e4789610F5";

export { ABI };
