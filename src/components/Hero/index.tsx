import { useContractData } from "../Context/ContractDataContext";
import { getWalletSymbol } from "../../utils/ProviderUtils";
import presentationPdf from "../../assets/presentation.pdf";


const Hero = () => {
  const { contractData } = useContractData();
  const symbol = getWalletSymbol();
  const heroTitle = import.meta.env.VITE_APP_HERO_TITLE || "";
  const heroSubtitle = import.meta.env.VITE_APP_HERO_DESCRIPTION || "";
  const buttonBgColor = import.meta.env.VITE_APP_BUTTON_BG_COLOR || "";
  const buttonTextColor = import.meta.env.VITE_APP_BUTTON_TEXT_COLOR || "";
  const cardBgColor = import.meta.env.VITE_APP_CARD_BG_COLOR || "";
  const textColor = import.meta.env.VITE_APP_TEXT_COLOR || "";
  const mutedTextColor = import.meta.env.VITE_APP_MUTED_TEXT_COLOR || "";
  const highlightColor = import.meta.env.VITE_APP_HIGHLIGHT_COLOR || "";
  const smartContractUrl = import.meta.env.VITE_APP_SMART_CONTRACT_LINK || "";
  return (
    <section className="hero-section ">
      <div className="hero-container py-2">
        <div className="hero-main">
          <div className="hero-content">
            <h1 className="hero-title" style={{ color: textColor }}>
              {heroTitle}
            </h1>
            <p className="hero-subtitle" style={{ color: mutedTextColor }}>
              {heroSubtitle}
            </p>

            <div className="hero-actions">
              <button
                className="hero-btn"
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                }}
                onClick={() => window.open(smartContractUrl, "_blank")}
              >
                Smart Contract
              </button>
              <button
                className="hero-btn"
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                }}
                onClick={() => window.open(presentationPdf, "_blank")}
              >
                Presentation
              </button>
            </div>
          </div>

          <div
            className="contract-stats-card"
            style={{ backgroundColor: cardBgColor }}
          >
            <div className="stats-header">
              <h3 style={{ color: textColor }}>Contract Stats</h3>
              <div className="live-indicator" style={{ color: highlightColor }}>
                <span
                  className="live-dot"
                  style={{ backgroundColor: highlightColor }}
                ></span>
                LIVE
              </div>
            </div>

            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-label" style={{ color: mutedTextColor }}>
                  Contract Balance
                </span>
                <span className="stat-value" style={{ color: textColor }}>
                  {contractData?.contractBalance || "0"} {symbol}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label" style={{ color: mutedTextColor }}>
                  Total Users
                </span>
                <span className="stat-value" style={{ color: textColor }}>
                  {contractData?.totalUsers || "0"}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label" style={{ color: mutedTextColor }}>
                  Total Deposit
                </span>
                <span className="stat-value" style={{ color: textColor }}>
                  {contractData?.totalInvested || "0"} {symbol}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label" style={{ color: mutedTextColor }}>
                  Total Withdrawn
                </span>
                <span className="stat-value" style={{ color: textColor }}>
                  {contractData?.totalWithdrawn || "0"} {symbol}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label" style={{ color: mutedTextColor }}>
                  Total Leadership Bonus
                </span>
                <span className="stat-value" style={{ color: textColor }}>
                  {contractData?.totalLeadershipBonus || "0"} {symbol}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label" style={{ color: mutedTextColor }}>
                  Total Referral Bonus
                </span>
                <span className="stat-value" style={{ color: textColor }}>
                  {contractData?.totalReferralBonus || "0"} {symbol}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
