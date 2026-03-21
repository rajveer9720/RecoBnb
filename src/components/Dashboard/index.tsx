import React, { useState, useEffect } from "react";
import { useUserData } from "../Context/ContractDataContext";
import { getWalletSymbol } from "../../utils/ProviderUtils";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACT_ADDRESS, ABI } from "../../utils/constants";
import { showSuccessAlert, showFailedAlert } from "../../utils/SweetAlertUtils";

const Dashboard: React.FC = () => {
  const { userData, refetch } = useUserData();
  const { address, isConnected } = useAccount();
  const symbol = getWalletSymbol();
  const buttonBgColor = import.meta.env.VITE_APP_BUTTON_BG_COLOR || "";
  const buttonTextColor = import.meta.env.VITE_APP_BUTTON_TEXT_COLOR || "";
  const textColor = import.meta.env.VITE_APP_TEXT_COLOR || "";
  const mutedTextColor = import.meta.env.VITE_APP_MUTED_TEXT_COLOR || "";
  const cardBgColor = import.meta.env.VITE_APP_CARD_BG_COLOR || "";
  const cardSecondBgColor = import.meta.env.VITE_APP_CARD_BG_SECOND_COLOR || "";

  const { data: nextWithdrawTime } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getNextWithdrawTime",
    args: [address],
  });

  const [loading, setLoading] = useState({
    roi: false,
    leadership: false,
    referral: false,
  });

  const [processedTxHash, setProcessedTxHash] = useState<string | null>(null);

  const { writeContract, data: hash, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isTransactionSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isTransactionSuccess && hash && hash !== processedTxHash) {
      setProcessedTxHash(hash);
      refetch();
      showSuccessAlert("Withdrawal processed successfully!");
      setLoading({
        roi: false,
        leadership: false,
        referral: false,
      });
    }
  }, [isTransactionSuccess, hash, processedTxHash, refetch]);

  useEffect(() => {
    if (error) {
      console.error("Transaction error:", error);
      showFailedAlert("Transaction failed. Please try again.");
      setLoading({
        roi: false,
        leadership: false,
        referral: false,
      });
    }
  }, [error]);

  const checkCooldown = (): boolean => {
    if (!nextWithdrawTime) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const withdrawTime = Number(nextWithdrawTime);

    if (currentTime < withdrawTime) {
      const remainingTime = withdrawTime - currentTime;
      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);

      let timeMessage = "";
      if (hours > 0) {
        timeMessage = `${hours} hour(s) and ${minutes} minute(s)`;
      } else {
        timeMessage = `${minutes} minute(s)`;
      }

      showFailedAlert(
        `Claim cooldown not met. Please wait ${timeMessage} before next withdrawal.`,
      );
      return false;
    }

    return true;
  };

  const handleWithdrawROI = async () => {
    if (!userData) {
      return;
    }

    if (parseFloat(userData.activeInvestments) === 0) {
      showFailedAlert("No ROI available to withdraw.");
      return;
    }
    if (!checkCooldown()) {
      return;
    }

    setLoading((prev) => ({ ...prev, roi: true }));

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "withdrawROI",
        args: [],
      });
    } catch (error) {
      console.error("ROI withdrawal error:", error);
      showFailedAlert("ROI withdrawal failed. Please try again.");
      setLoading((prev) => ({ ...prev, roi: false }));
    }
  };

  const handleWithdrawLeadership = async () => {
    if (!userData) {
      return;
    }

    if (parseFloat(userData.leadershipBonus) === 0) {
      showFailedAlert("No leadership bonus available to withdraw.");
      return;
    }
    if (!checkCooldown()) {
      return;
    }

    setLoading((prev) => ({ ...prev, leadership: true }));

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "withdrawLeadership",
        args: [],
      });
    } catch (error) {
      console.error("Leadership withdrawal error:", error);
      showFailedAlert("Leadership withdrawal failed. Please try again.");
      setLoading((prev) => ({ ...prev, leadership: false }));
    }
  };

  const handleWithdrawReferral = async () => {
    if (!userData) {
      return;
    }

    if (parseFloat(userData.referralBonus) === 0) {
      showFailedAlert("No referral bonus available to withdraw.");
      return;
    }

    if (!checkCooldown()) {
      return;
    }

    setLoading((prev) => ({ ...prev, referral: true }));

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "withdrawReferral",
        args: [],
      });
    } catch (error) {
      console.error("Referral withdrawal error:", error);
      showFailedAlert("Referral withdrawal failed. Please try again.");
      setLoading((prev) => ({ ...prev, referral: false }));
    }
  };

  return (
    <section className="dashboard-section">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title" style={{ color: textColor }}>
            Investment Dashboard
          </h2>
          <p className="dashboard-subtitle" style={{ color: mutedTextColor }}>
            Track your ROI performance and optimize your DeFi strategy
          </p>
        </div>
        <div className="dashboard-cards-container">
          <div
            className="dashboard-card card-1"
            style={{ backgroundColor: cardBgColor }}
          >
            <div className="balance-cards">
              <div
                className="balance-card"
                style={{ backgroundColor: cardSecondBgColor }}
              >
                <div className="balance-icon">💰</div>
                <div className="balance-info">
                  <h3 className="balance-amount" style={{ color: textColor }}>
                    {userData?.userTotalInvested || "0"} {symbol}
                  </h3>
                  <p
                    className="balance-label"
                    style={{ color: mutedTextColor }}
                  >
                    TOTAL INVESTED
                  </p>
                </div>
              </div>

              <div
                className="balance-card"
                style={{ backgroundColor: cardSecondBgColor }}
              >
                <div className="balance-icon">📊</div>
                <div className="balance-info">
                  <h3 className="balance-amount" style={{ color: textColor }}>
                    {userData?.userTotalWithdrawn || "0"} {symbol}
                  </h3>
                  <p
                    className="balance-label"
                    style={{ color: mutedTextColor }}
                  >
                    TOTAL WITHDRAWN
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-actions">
              {isConnected ? (
                <>
                  <button
                    className="action-btn secondary-btn"
                    onClick={handleWithdrawROI}
                    disabled={loading.roi || isConfirming || !userData}
                    style={{
                      backgroundColor: buttonBgColor,
                      color: buttonTextColor,
                      opacity: loading.roi || isConfirming || !userData ? 0.7 : 1,
                      cursor:
                        loading.roi || isConfirming || !userData ? "not-allowed" : "pointer",
                    }}
                  >
                    Withdraw ROI
                  </button>
                  <button
                    className="action-btn secondary-btn"
                    onClick={handleWithdrawLeadership}
                    disabled={loading.leadership || isConfirming || !userData}
                    style={{
                      backgroundColor: buttonBgColor,
                      color: buttonTextColor,
                      opacity: loading.leadership || isConfirming || !userData ? 0.7 : 1,
                      cursor:
                        loading.leadership || isConfirming || !userData
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Withdraw Leadership
                  </button>
                  <button
                    className="action-btn secondary-btn"
                    onClick={handleWithdrawReferral}
                    disabled={loading.referral || isConfirming || !userData}
                    style={{
                      backgroundColor: buttonBgColor,
                      color: buttonTextColor,
                      opacity: loading.referral || isConfirming || !userData ? 0.7 : 1,
                      cursor:
                        loading.referral || isConfirming || !userData
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Withdraw Referral
                  </button>
                </>
              ) : (
                <>
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button
                        className="action-btn secondary-btn"
                        onClick={openConnectModal}
                        style={{
                          backgroundColor: buttonBgColor,
                          color: buttonTextColor,
                        }}
                      >
                        Withdraw ROI
                      </button>
                    )}
                  </ConnectButton.Custom>
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button
                        className="action-btn secondary-btn"
                        onClick={openConnectModal}
                        style={{
                          backgroundColor: buttonBgColor,
                          color: buttonTextColor,
                        }}
                      >
                        Withdraw Leadership
                      </button>
                    )}
                  </ConnectButton.Custom>
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button
                        className="action-btn secondary-btn"
                        onClick={openConnectModal}
                        style={{
                          backgroundColor: buttonBgColor,
                          color: buttonTextColor,
                        }}
                      >
                        Withdraw Referral
                      </button>
                    )}
                  </ConnectButton.Custom>
                </>
              )}
            </div>
          </div>
          <div
            className="dashboard-card"
            style={{ backgroundColor: cardBgColor }}
          >
            <div className="investment-status">
              <div
                className="status-card"
                style={{ backgroundColor: cardSecondBgColor }}
              >
                <div
                  className="status-info"
                  style={{ color: textColor }}
                >
                  <div className="status-item">
                    <span className="status-dot status-dot-purple" />
                    <span className="status-label">Active Investments</span>
                    <span className="status-value">
                      {userData?.activeInvestments || "0"}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot status-dot-yellow" />
                    <span className="status-label">Referral Bonus</span>
                    <span className="status-value">
                      {userData?.referralBonus || "0"} {symbol}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot status-dot-green" />
                    <span className="status-label">Leadership Bonus</span>
                    <span className="status-value">
                      {userData?.leadershipBonus || "0"} {symbol}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot status-dot-blue" />
                    <span className="status-label">Referral Newest Withdrawn</span>
                    <span className="status-value">
                      {userData?.referralBonusWithdrawn || "0"} {symbol}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot status-dot-pink" />
                    <span className="status-label">Leadership Bonus Minimum</span>
                    <span className="status-value">
                      {userData?.leadershipBonusWithdrawn || "0"} {symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
