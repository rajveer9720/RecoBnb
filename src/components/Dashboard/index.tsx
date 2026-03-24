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

  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const nextWithdrawTimestamp = Number(nextWithdrawTime ?? 0);
  const isOnCooldown = nextWithdrawTimestamp > now;
  const remainingSeconds = isOnCooldown ? nextWithdrawTimestamp - now : 0;
  const rHours = Math.floor(remainingSeconds / 3600);
  const rMins = Math.floor((remainingSeconds % 3600) / 60);
  const rSecs = remainingSeconds % 60;
  const countdownStr = `${String(rHours).padStart(2, "0")}h ${String(rMins).padStart(2, "0")}m ${String(rSecs).padStart(2, "0")}s`;

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
    if (isOnCooldown) {
      showFailedAlert(
        `Cooldown active. Please wait ${countdownStr} before next withdrawal.`,
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

    if (parseFloat(userData.referralBonus) === 0 && parseFloat(userData.poolBonus || "0") === 0) {
      showFailedAlert("No referral or pool bonus available to withdraw.");
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
            User Dashboard
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

            {/* Cooldown countdown banner */}
            {isConnected && isOnCooldown && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  borderRadius: "8px",
                  padding: "0.55rem 1rem",
                  marginBottom: "0.75rem",
                  fontSize: "0.85rem",
                  color: "#f87171",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                <span style={{ fontSize: "1rem" }}>⏳</span>
                Cooldown active — next withdrawal in&nbsp;
                <span style={{ fontVariantNumeric: "tabular-nums", minWidth: "90px", display: "inline-block" }}>
                  {countdownStr}
                </span>
              </div>
            )}

            <div className="dashboard-actions">
              {isConnected ? (
                <>
                  <button
                    className="action-btn secondary-btn"
                    onClick={handleWithdrawROI}
                    disabled={loading.roi || isConfirming || !userData || isOnCooldown}
                    style={{
                      backgroundColor: buttonBgColor,
                      color: buttonTextColor,
                      opacity: loading.roi || isConfirming || !userData || isOnCooldown ? 0.7 : 1,
                      cursor:
                        loading.roi || isConfirming || !userData || isOnCooldown ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading.roi ? "Processing…" : "Withdraw ROI"}
                  </button>
                  <button
                    className="action-btn secondary-btn"
                    onClick={handleWithdrawLeadership}
                    disabled={loading.leadership || isConfirming || !userData || isOnCooldown}
                    style={{
                      backgroundColor: buttonBgColor,
                      color: buttonTextColor,
                      opacity: loading.leadership || isConfirming || !userData || isOnCooldown ? 0.7 : 1,
                      cursor:
                        loading.leadership || isConfirming || !userData || isOnCooldown
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {loading.leadership ? "Processing…" : "Withdraw Leadership"}
                  </button>
                  <button
                    className="action-btn secondary-btn"
                    onClick={handleWithdrawReferral}
                    disabled={loading.referral || isConfirming || !userData || isOnCooldown}
                    style={{
                      backgroundColor: buttonBgColor,
                      color: buttonTextColor,
                      opacity: loading.referral || isConfirming || !userData || isOnCooldown ? 0.7 : 1,
                      cursor:
                        loading.referral || isConfirming || !userData || isOnCooldown
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {loading.referral ? "Processing…" : "Withdraw Referral"}
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
                    <span className="status-label">Referral Withdrawn</span>
                    <span className="status-value">
                      {userData?.referralBonusWithdrawn || "0"} {symbol}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot status-dot-pink" />
                    <span className="status-label">Leadership Withdrawn</span>
                    <span className="status-value">
                      {userData?.leadershipBonusWithdrawn || "0"} {symbol}
                    </span>
                  </div>
                  {userData?.isInPool && (
                    <>
                      <div className="status-item">
                        <span className="status-dot" style={{ backgroundColor: "#f97316" }} />
                        <span className="status-label">Pool Bonus Available</span>
                        <span className="status-value">
                          {userData?.poolBonus || "0"} {symbol}
                        </span>
                      </div>
                      <div className="status-item">
                        <span className="status-dot" style={{ backgroundColor: "#06b6d4" }} />
                        <span className="status-label">Pool Bonus Withdrawn</span>
                        <span className="status-value">
                          {userData?.poolBonusWithdrawn || "0"} {symbol}
                        </span>
                      </div>
                    </>
                  )}
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
