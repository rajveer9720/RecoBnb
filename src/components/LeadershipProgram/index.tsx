import React from "react";
import { useUserData } from "../Context/ContractDataContext";
import { formatDecimal } from "../../utils/formatUtils";

const LeadershipProgram: React.FC = () => {
  const cardBgColor = import.meta.env.VITE_APP_CARD_BG_COLOR || "";
  const textColor = import.meta.env.VITE_APP_TEXT_COLOR || "";
  const mutedTextColor = import.meta.env.VITE_APP_MUTED_TEXT_COLOR || "";
  const { userData } = useUserData();

  const totalClaimed =
    userData?.totalClaimeds?.reduce((sum, amount) => {
      return sum + parseFloat(amount || "0");
    }, 0) || 0;

  const activeCount =
    userData?.actives?.filter((active) => active === true).length || 0;

  const totalPendingRewards =
    userData?.pendingRewards?.reduce((sum, amount) => {
      return sum + parseFloat(amount || "0");
    }, 0) || 0;

  return (
    <section className="leadership-section">
      <div className="leadership-container">
        <div className="leadership-header">
          <h2 className="leadership-title" style={{ color: textColor }}>
            Leadership Program
          </h2>
          <p className="leadership-subtitle" style={{ color: mutedTextColor }}>
            Unlock leadership bonuses by building winning teams
          </p>
        </div>

        <div className="leadership-content">
          <div className="leadership-stats-section">
            <div className="leadership-stats">
              <div
                className="leadership-stat-card"
                style={{ backgroundColor: cardBgColor }}
              >
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3 className="stat-amount" style={{ color: textColor }}>
                    Total Claimed
                  </h3>
                  <p className="stat-label" style={{ color: mutedTextColor }}>
                    {formatDecimal(totalClaimed, 4)} BNB
                  </p>
                </div>
              </div>

              <div
                className="leadership-stat-card"
                style={{ backgroundColor: cardBgColor }}
              >
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3 className="stat-amount" style={{ color: textColor }}>
                    Active
                  </h3>
                  <p className="stat-label" style={{ color: mutedTextColor }}>
                    {activeCount} Investments
                  </p>
                </div>
              </div>

              <div
                className="leadership-stat-card"
                style={{ backgroundColor: cardBgColor }}
              >
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <h3
                    className="stat-amount"
                    style={{ color: textColor, whiteSpace: "nowrap" }}
                  >
                    Pending Rewards
                  </h3>
                  <p className="stat-label" style={{ color: mutedTextColor }}>
                    {formatDecimal(totalPendingRewards, 4)} BNB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipProgram;
