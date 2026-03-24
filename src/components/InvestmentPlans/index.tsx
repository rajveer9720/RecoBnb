import React, { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useBalance,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseEther, formatEther } from "viem";
import { ABI, CONTRACT_ADDRESS } from "../../utils/constants";
import { showSuccessAlert, showFailedAlert, showWarningAlert } from "../../utils/SweetAlertUtils";
import { useContractData, useUserData } from "../Context/ContractDataContext";

interface InvestmentPlan {
  id: number;
  name: string;
  minDeposit: string;
  maxDeposit: string;
  dailyROI: string;
  duration: string;
  totalReturn: string;
  claimCooldown: string;
  color: string;
}

const InvestmentPlans: React.FC = () => {
  const buttonBgColor = import.meta.env.VITE_APP_BUTTON_BG_COLOR || "";
  const buttonTextColor = import.meta.env.VITE_APP_BUTTON_TEXT_COLOR || "";
  const textColor = import.meta.env.VITE_APP_TEXT_COLOR || "";
  const mutedTextColor = import.meta.env.VITE_APP_MUTED_TEXT_COLOR || "";
  const cardBgColor = import.meta.env.VITE_APP_CARD_BG_COLOR || "";

  const { isConnected, address } = useAccount();
  const [investmentAmounts, setInvestmentAmounts] = useState<{
    [key: number]: string;
  }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [toastShown, setToastShown] = useState(false);
  const [plans, setPlans] = useState<InvestmentPlan[]>([
    { id: 0, name: "Gold Plan (Plan 1)", minDeposit: "0.02", maxDeposit: "100",       dailyROI: "1.30%", duration: "100 Days", totalReturn: "130%", claimCooldown: "8 Hours", color: "gold"     },
    { id: 1, name: "Platinum Plan (Plan 2)", minDeposit: "0.1",  maxDeposit: "1000",      dailyROI: "0.90%", duration: "200 Days", totalReturn: "180%", claimCooldown: "8 Hours", color: "platinum" },
    { id: 2, name: "Diamond Plan (Plan 3)", minDeposit: "1",    maxDeposit: "Unlimited", dailyROI: "0.70%", duration: "300 Days", totalReturn: "210%", claimCooldown: "8 Hours", color: "diamond"  },
  ]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const { writeContract, data: hash, error: investError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isTransactionSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
  });

  const contractDataContext = useContractData();
  const userDataContext = useUserData();

  const { data: plan0Data, refetch: refetchPlan0 } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getPlanInfo",
    args: [0],
  });

  const { data: plan1Data, refetch: refetchPlan1 } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getPlanInfo",
    args: [1],
  });

  const { data: plan2Data, refetch: refetchPlan2 } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getPlanInfo",
    args: [2],
  });
  const getReferrer = (): string => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    return ref && ref.length === 42 && ref.startsWith("0x")
      ? ref
      : import.meta.env.VITE_APP_PROJECT_ADDRESS;
  };
  const referrer = getReferrer();

  const refetch = async () => {
    try {
      const wagmiRefetchPromises = [
        refetchPlan0(),
        refetchPlan1(),
        refetchPlan2(),
        refetchBalance(),
      ];

      const contextRefetchPromises: Promise<void>[] = [];

      if (
        contractDataContext &&
        typeof contractDataContext.refetch === "function"
      ) {
        contextRefetchPromises.push(contractDataContext.refetch());
      }

      if (
        userDataContext &&
        typeof userDataContext.refetch === "function" &&
        address
      ) {
        contextRefetchPromises.push(userDataContext.refetch());
      }

      await Promise.all([
        Promise.all(wagmiRefetchPromises),
        Promise.all(contextRefetchPromises),
      ]);
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  };

  useEffect(() => {
    const processPlanData = () => {
      const planNames = ["Gold Plan (Plan 1)", "Platinum Plan (Plan 2)", "Diamond Plan (Plan 3)"];
      const planColors = ["gold", "platinum", "diamond"];
      const contractPlans = [plan0Data, plan1Data, plan2Data];

      const processedPlans: InvestmentPlan[] = [];

      contractPlans.forEach((planData, index) => {
        if (planData && Array.isArray(planData) && planData.length === 5) {
          const [minDeposit, maxDeposit, dailyROI, duration, totalReturn] =
            planData;

          processedPlans.push({
            id: index,
            name: planNames[index],
            minDeposit: formatEther(minDeposit),
            maxDeposit:
              maxDeposit ===
              BigInt(
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
              )
                ? "Unlimited"
                : formatEther(maxDeposit),
            dailyROI: `${(Number(dailyROI) / 100).toString()}%`,
            duration: `${duration.toString()} days`,
            totalReturn: `${(Number(totalReturn) / 100).toString()}%`,
            claimCooldown: "8 Hours",
            color: planColors[index],
          });
        }
      });

      if (processedPlans.length > 0) {
        setPlans(processedPlans);
        setIsLoadingPlans(false);
      }
    };

    if (plan0Data || plan1Data || plan2Data) {
      processPlanData();
    }
  }, [plan0Data, plan1Data, plan2Data]);

  const handleAmountChange = (planId: number, value: string) => {
    setInvestmentAmounts((prev) => ({
      ...prev,
      [planId]: value,
    }));

    if (value && balanceData) {
      const amount = Number(value);
      const userBalance = Number(formatEther(balanceData.value));
      if (amount > userBalance) {
        showWarningAlert(
          `Your balance: ${userBalance.toFixed(4)} BNB. Required: ${amount.toFixed(4)} BNB.`
        );
      }
    }
  };

  const validateInvestmentAmount = (
    plan: InvestmentPlan,
    amount: string,
  ): boolean => {
    if (!amount || isNaN(Number(amount))) {
      showFailedAlert("Please enter a valid amount");
      return false;
    }

    const amountNum = Number(amount);
    const minAmount = Number(plan.minDeposit.replace(" ETH", ""));
    if (amountNum < minAmount) {
      showFailedAlert(
        `Minimum investment for ${plan.name} is ${plan.minDeposit}`,
      );
      return false;
    }

    if (plan.maxDeposit !== "Unlimited") {
      const maxAmount = Number(plan.maxDeposit.replace(" ETH", ""));
      if (amountNum > maxAmount) {
        showFailedAlert(
          `Maximum investment for ${plan.name} is ${plan.maxDeposit}`,
        );
        return false;
      }
    }

    if (balanceData) {
      const userBalance = Number(formatEther(balanceData.value));
      if (amountNum > userBalance) {
        showFailedAlert(
          `Insufficient balance. Your balance: ${userBalance.toFixed(4)} BNB. Required: ${amountNum.toFixed(4)} BNB.`
        );
        return false;
      }
    }

    return true;
  };

  const handleInvestment = async (plan: InvestmentPlan) => {
    const amount = investmentAmounts[plan.id];
    if (!validateInvestmentAmount(plan, amount)) {
      return;
    }

    setLoading((prev) => ({ ...prev, [plan.id]: true }));
    setToastShown(false);

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "invest",
        args: [plan.id, referrer],
        value: parseEther(amount),
      });
    } catch (error) {
      console.error("Investment error:", error);
      showFailedAlert("Investment failed. Please try again.");
      setLoading((prev) => ({ ...prev, [plan.id]: false }));
    }
  };

  useEffect(() => {
    if (isTransactionSuccess && hash && !toastShown) {
      refetch();
      showSuccessAlert(`Your investment has been processed successfully!`);
      setToastShown(true);

      const planId = Object.keys(loading).find((key) => loading[Number(key)]);
      if (planId) {
        setInvestmentAmounts((prev) => ({ ...prev, [Number(planId)]: "" }));
      }
    }
  }, [isTransactionSuccess, hash, refetch, toastShown, loading]);
  useEffect(() => {
    if (!isTransactionSuccess && !isConfirming) {
      setToastShown(false);
    }
  }, [isTransactionSuccess, isConfirming]);

  useEffect(() => {
    if (investError) {
      showFailedAlert("Something went wrong. Please try again.");
      setLoading({});
      return;
    }
  }, [investError]);

  useEffect(() => {
    if ((isTransactionSuccess || investError) && !isConfirming) {
      setLoading({});
    }
  }, [isTransactionSuccess, investError, isConfirming]);

  return (
    <section className="investment-plans-section" id="invest">
      <div className="plans-container">
        <div className="plans-header">
          <h2 className="plans-title" style={{ color: textColor }}>
            DeFi Investment Plans
          </h2>
          <p className="plans-subtitle" style={{ color: mutedTextColor }}>
            Maximize your returns with our optimized ROI system and smart
            contract security
          </p>
        </div>

        <div className="plans-grid side-by-side">
          {isLoadingPlans ? (
            <div
              className="loading-plans"
              style={{ color: textColor, textAlign: "center", padding: "2rem" }}
            >
              Loading investment plans from contract...
            </div>
          ) : (
            plans.map((plan, index) => (
              <div
                key={index}
                className={`plan-card`}
                style={{ backgroundColor: cardBgColor }}
              >
                <h3 style={{ color: textColor, textAlign: "center", marginBottom: "1rem", fontSize: "1.2rem", fontWeight: "bold" }}>
                  {plan.name}
                </h3>
                <div className="input-group">
                  <label
                    htmlFor={`investment-${plan.id}`}
                    style={{
                      color: textColor,
                      textAlign: "center",
                      width: "100%",
                    }}
                    className="mb-1"
                  >
                    Investment Amount
                  </label>
                  <input
                    id={`investment-${plan.id}`}
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder={`Min: ${plan.minDeposit.replace(" ETH", "")}`}
                    value={investmentAmounts[plan.id] || ""}
                    onChange={(e) =>
                      handleAmountChange(plan.id, e.target.value)
                    }
                    className=""
                    style={{
                      flex: 1,
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "1rem",
                      color: "white",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                <div
                  className="status-card mt-3"
                  style={{ backgroundColor: cardBgColor }}
                >
                  <div className="detail-row">
                    <span style={{ color: mutedTextColor }}>Min Deposit:</span>
                    <span style={{ color: textColor }}>{plan.minDeposit}</span>
                  </div>
                  <div className="detail-row">
                    <span style={{ color: mutedTextColor }}>Max Deposit:</span>
                    <span style={{ color: textColor }}>{plan.maxDeposit}</span>
                  </div>
                  <div className="detail-row">
                    <span style={{ color: mutedTextColor }}>Daily ROI:</span>
                    <span style={{ color: textColor }}>{plan.dailyROI}</span>
                  </div>
                  <div className="detail-row">
                    <span style={{ color: mutedTextColor }}>Duration:</span>
                    <span style={{ color: textColor }}>{plan.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span style={{ color: mutedTextColor }}>Total Return:</span>
                    <span style={{ color: textColor }}>{plan.totalReturn}</span>
                  </div>
                </div>

                <div className="investment-section mt-3">
                  {isConnected ? (
                    <button
                      className="select-plan-btn"
                      style={{
                        backgroundColor: buttonBgColor,
                        color: buttonTextColor,
                        opacity: loading[plan.id] || isConfirming ? 0.6 : 1,
                      }}
                      onClick={() => handleInvestment(plan)}
                      disabled={loading[plan.id] || isConfirming}
                    >
                      Invest
                    </button>
                  ) : (
                    <ConnectButton.Custom>
                      {({ openConnectModal }) => (
                        <button
                          className="select-plan-btn"
                          style={{
                            backgroundColor: buttonBgColor,
                            color: buttonTextColor,
                          }}
                          onClick={openConnectModal}
                        >
                          Invest
                        </button>
                      )}
                    </ConnectButton.Custom>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default InvestmentPlans;
