import React, { useEffect, useState } from "react";
import { useReadContract, useAccount } from "wagmi";
import { useUserData } from "../Context/ContractDataContext";
import { formatDecimal } from "../../utils/formatUtils";
import { ABI, CONTRACT_ADDRESS } from "../../utils/constants";

const LeadershipProgram: React.FC = () => {
  const cardBgColor = import.meta.env.VITE_APP_CARD_BG_COLOR || "";
  const textColor = import.meta.env.VITE_APP_TEXT_COLOR || "";
  const mutedTextColor = import.meta.env.VITE_APP_MUTED_TEXT_COLOR || "";
  const { userData } = useUserData();
  const { address } = useAccount();

  const { data: poolInfoData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getPoolInfo",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const poolWindowOpen  = poolInfoData ? Number((poolInfoData as any[])[3]) : 0;
  const poolWindowClose = poolInfoData ? Number((poolInfoData as any[])[4]) : 0;
  const totalPoolMembers = poolInfoData ? Number((poolInfoData as any[])[2]) : 0;

  const nowSec = () => Math.floor(Date.now() / 1000);
  const [now, setNow] = useState(nowSec());

  useEffect(() => {
    const id = setInterval(() => setNow(nowSec()), 1000);
    return () => clearInterval(id);
  }, []);

  const windowIsOpen = poolWindowClose > 0 && now < poolWindowClose;
  const remaining   = poolWindowClose > now ? poolWindowClose - now : 0;
  const rHours      = Math.floor(remaining / 3600);
  const rMins       = Math.floor((remaining % 3600) / 60);
  const rSecs       = remaining % 60;
  const countdownStr = remaining > 0
    ? `${String(rHours).padStart(2, "0")}h ${String(rMins).padStart(2, "0")}m ${String(rSecs).padStart(2, "0")}s`
    : "Closed";

  const launchDate = poolWindowOpen > 0
    ? new Date(poolWindowOpen * 1000).toLocaleString()
    : "—";

  const showPoolCard = windowIsOpen || userData?.isInPool;

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

        {showPoolCard && (
          <div
            style={{
              margin: "2rem 0",
              borderRadius: "12px",
              padding: "1.5rem",
              background: cardBgColor,
              color: textColor,
            }}
          >
            <h3
              style={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              🏆 Leaderboard Bonus Pool
            </h3>

            {/* Launch time & window status */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "8px", padding: "0.6rem 1rem", flex: "1", minWidth: "160px" }}>
                <div style={{ color: mutedTextColor, fontSize: "0.75rem", marginBottom: "0.2rem" }}>Contract Launch</div>
                <div style={{ color: textColor, fontWeight: "600", fontSize: "0.95rem" }}>{launchDate}</div>
              </div>
              <div style={{ background: windowIsOpen ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", borderRadius: "8px", padding: "0.6rem 1rem", flex: "1", minWidth: "160px" }}>
                <div style={{ color: mutedTextColor, fontSize: "0.75rem", marginBottom: "0.2rem" }}>
                  {windowIsOpen ? "⏳ Window closes in" : "🔒 Entry Window"}
                </div>
                <div style={{ color: windowIsOpen ? "#22c55e" : "#ef4444", fontWeight: "700", fontSize: "0.95rem", fontVariantNumeric: "tabular-nums" }}>
                  {windowIsOpen ? countdownStr : "Closed"}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "8px", padding: "0.6rem 1rem", flex: "1", minWidth: "140px" }}>
                <div style={{ color: mutedTextColor, fontSize: "0.75rem", marginBottom: "0.2rem" }}>Pool Members</div>
                <div style={{ color: textColor, fontWeight: "600", fontSize: "0.95rem" }}>{totalPoolMembers}</div>
              </div>
            </div>

            <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              Top promoters &amp; investors in the first <strong>72 hours</strong>{" "}
              will share a <strong>special BNB reward pool</strong>.
            </p>
            <ul style={{ paddingLeft: "1.25rem", margin: 0, lineHeight: "2", fontSize: "0.9rem" }}>
              <li><strong>5% of contract balance</strong> distributed equally among all pool members</li>
              <li>Must <strong>invest within the first 72 hours</strong> of launch</li>
              <li>Must get at least <strong>1 direct referral</strong> within the same window</li>
              <li>Distributions every <strong>24 hours</strong> after the first (at 72h mark)</li>
              <li>Pool bonus is withdrawable via <strong>Withdraw Referral</strong></li>
            </ul>

            {/* User's pool earnings — only if in pool */}
            {userData?.isInPool && (
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "8px", padding: "0.75rem 1.25rem" }}>
                  <div style={{ color: mutedTextColor, fontSize: "0.8rem" }}>Pool Bonus Available</div>
                  <div style={{ color: textColor, fontWeight: "700", fontSize: "1.1rem" }}>
                    {formatDecimal(parseFloat(userData?.poolBonus || "0"), 4)} BNB
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "8px", padding: "0.75rem 1.25rem" }}>
                  <div style={{ color: mutedTextColor, fontSize: "0.8rem" }}>Pool Bonus Withdrawn</div>
                  <div style={{ color: textColor, fontWeight: "700", fontSize: "1.1rem" }}>
                    {formatDecimal(parseFloat(userData?.poolBonusWithdrawn || "0"), 4)} BNB
                  </div>
                </div>
              </div>
            )}

            {/* Not yet in pool but window still open */}
            {!userData?.isInPool && windowIsOpen && (
              <p style={{ marginTop: "1rem", color: "#facc15", fontSize: "0.85rem", fontWeight: "600" }}>
                ⚡ You are not in the pool yet. Invest now and get 1 direct referral before the window closes to qualify!
              </p>
            )}
          </div>
        )}

        <div className="leadership-content">
          <div className="leadership-stats-section">
            <div className="leadership-stats">
              <div className="leadership-stat-card" style={{ backgroundColor: cardBgColor }}>
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3 className="stat-amount" style={{ color: textColor }}>Total Claimed</h3>
                  <p className="stat-label" style={{ color: mutedTextColor }}>
                    {formatDecimal(totalClaimed, 4)} BNB
                  </p>
                </div>
              </div>

              <div className="leadership-stat-card" style={{ backgroundColor: cardBgColor }}>
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3 className="stat-amount" style={{ color: textColor }}>Active</h3>
                  <p className="stat-label" style={{ color: mutedTextColor }}>
                    {activeCount} Investments
                  </p>
                </div>
              </div>

              <div className="leadership-stat-card" style={{ backgroundColor: cardBgColor }}>
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <h3 className="stat-amount" style={{ color: textColor, whiteSpace: "nowrap" }}>
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

