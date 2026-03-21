import React, { useState } from "react";
import { useUserData } from "../Context/ContractDataContext";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";

const ReferralProgram: React.FC = () => {
  const { userData } = useUserData();
  const { address } = useAccount();

  const [copied, setCopied] = useState(false);
  const textColor = import.meta.env.VITE_APP_TEXT_COLOR || "";
  const mutedTextColor = import.meta.env.VITE_APP_MUTED_TEXT_COLOR || "";
  const cardBgColor = import.meta.env.VITE_APP_CARD_BG_COLOR || "";
  const cardSecondBgColor = import.meta.env.VITE_APP_CARD_BG_SECOND_COLOR || "";
  const projectAddress = import.meta.env.VITE_APP_PROJECT_ADDRESS || "";
  const adminAddress = import.meta.env.VITE_APP_ADMIN_ADDRESS || "";
  const refSwitch = import.meta.env.VITE_APP_REFERRAL_SWITCH || "";
    const buttonBgColor = import.meta.env.VITE_APP_BUTTON_BG_COLOR || "";
  const buttonTextColor = import.meta.env.VITE_APP_BUTTON_TEXT_COLOR || "";

  const isEligible =
    address &&
    (address === projectAddress ||
      address === adminAddress ||
      (userData?.userTotalInvested && Number(userData?.userTotalInvested) > 0));

  const referralLink = isEligible
    ? `${window.location.origin}/?ref=${address}`
    : "";
  const handleCopyClick = async () => {
    if (refSwitch !== "true") {
      toast.error("Referral feature is disabled");
      return;
    }
    if (!address) {
      toast.error("Wallet not connected!");
      return;
    }
    if (!isEligible) {
      toast.error("You will get your referral link after investing.");
      return;
    }

    setCopied(true);
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied to clipboard!");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Referral link copied to clipboard!");
    }
    setTimeout(() => setCopied(false), 2000);
  };
  const commissionLevels = Array.from({ length: 15 }, (_, index) => {
    const level = index + 1;
    const referralCount = userData?.referralLevels?.[index] || "0";

    return {
      level: level.toString(),
      percentage: import.meta.env[`VITE_APP_LEVEL_${level}_PERCENTAGE`] || "",
      count: `${referralCount} REFERRALS`,
    };
  });

  return (
    <section className="referral-section">
      <div className="referral-container">
        <div className="referral-header">
          <h2 className="referral-title" style={{ color: textColor }}>
            Referral Program
          </h2>
          <p className="referral-subtitle p-2" style={{ color: mutedTextColor }}>
            Earn commissions from up to levels of referrals
          </p>
        </div>

        <div className="referral-content">
          <div className="referral-section p-2">
            <div
              className="referral-link-section"
              style={{ backgroundColor: cardBgColor }}
            >
              <h3 className="referral-link-title" style={{ color: textColor }}>
                Your Referral Link
              </h3>
              <p
                className="referral-link-subtitle"
                style={{ color: mutedTextColor }}
              >
                Share this link to grow your network
              </p>

              <div className="referral-link-container">
                <input
                  type="text"
                  value={
                    isEligible
                      ? referralLink
                      : "You will get your referral link after investing"
                  }
                  readOnly
                  className="referral-link-input"
                  style={{
                    color: isEligible ? textColor : mutedTextColor,
                    backgroundColor: cardSecondBgColor,
                  }}
                />
                <button
                  onClick={handleCopyClick}
                  style={{
                    backgroundColor: buttonBgColor,
                    color: buttonTextColor,
                    fontWeight: "bold",
                  }}
                  className={`copy-btn ${copied ? "copied" : ""}`}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          <div className="referral-section">
            <div className="commission-levels">
              <h2 className="commission-title" style={{ color: textColor }}>
                Commission Structure
              </h2>
              <div className="commission-grid">
                {commissionLevels.map((level, index) => (
                  <div
                    key={index}
                    className="commission-card"
                    style={{ backgroundColor: cardBgColor }}
                  >
                    <div
                      className="commission-level"
                      style={{
                        color: textColor,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Level{level.level}</span>
                      <span style={{ color: textColor }}>
                        {level.percentage}%
                      </span>
                    </div>
                    
                    <div
                      className="commission-info"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      
                      <span style={{ color: mutedTextColor }}>
                        {level.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralProgram;
