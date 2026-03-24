import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const cardBgColor = import.meta.env.VITE_APP_CARD_BG_COLOR || "";
  const textColor = import.meta.env.VITE_APP_TEXT_COLOR || "";
  const mutedTextColor = import.meta.env.VITE_APP_MUTED_TEXT_COLOR || "";
  const AppTitle = import.meta.env.VITE_APP_TITLE || "";

  const faqData: FAQItem[] = [
    {
      question: "How does the Investment process work?",
      answer:
        "Our investment process is simple and secure. You connect your wallet, choose from three investment plans (Gold, Platinum, Diamond), and deposit BNB/ETH into your chosen plan. Smart contract algorithms generate returns automatically. All investments are processed instantly on the blockchain.",
    },
    {
      question: "What are the Minimum and maximum Investment amounts?",
      answer:
        "Minimum investment varies by plan: Plan 1 (0.02 BNB), Plan 2 (0.1 BNB), Plan 3 (1 BNB). Maximum investment limits are: Plan 1 (100 BNB), Plan 2 (1000 BNB), Plan 3 (Unlimited). These amounts are dynamically loaded from the smart contract.",
    },
    {
      question: "How are daily returns calculated?",
      answer:
        "Daily returns are calculated automatically by smart contracts based on your plan's ROI rate: Gold Plan (1.30% daily), Platinum Plan (0.90% daily), Diamond Plan (0.70% daily). Returns are calculated based on your investment amount and can be withdrawn after the cooldown period.",
    },
    {
      question: "How does the referral program work?",
      answer:
        "Earn commissions by referring new investors. You receive a percentage of your referrals' investments as commission, paid directly to your account.",
    },
    {
      question: "How does the leadership program work?",
      answer:
        "The leadership program rewards active members with additional bonuses based on their team's performance and investment volume.",
    },
    {
      question: "Is there a withdrawal fee?",
      answer:
        "Withdrawals require standard blockchain gas fees for transaction processing. The smart contract may apply minimal network fees. Check the current network fees in your wallet before withdrawing.",
    },
    {
      question: `How secure is ${AppTitle}?`,
      answer:
        "We use bank-grade security measures including SSL encryption, two-factor authentication, and secure cold storage for funds.",
    },
    {
      question:
        "What happens if I refer someone but don't meet the requirements for higher bonus?",
      answer:
        "You'll still earn the base referral commission. Higher tier bonuses are unlocked as you meet the requirements for each leadership level.",
    },
    {
      question: "Can I have multiple active investments at the same time?",
      answer:
        "Yes, you can have multiple active investments across different plans simultaneously to diversify your portfolio.",
    },
    {
      question: "What happens when an investment plan ends?",
      answer:
        "When your plan completes its cycle, the principal amount plus accumulated profits are credited to your account balance for withdrawal or reinvestment.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    );
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title" style={{ color: textColor }}>
            Frequently Asked Questions
          </h2>
          <p className="faq-subtitle" style={{ color: mutedTextColor }}>
            Find Answers to common questions about RecoBnb
          </p>
        </div>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openItems.includes(index) ? "open" : ""}`}
              style={{ backgroundColor: cardBgColor }}
            >
              <button
                className="faq-question"
                style={{ color: textColor }}
                onClick={() => toggleItem(index)}
              >
                <span>{item.question}</span>
                <span className="faq-icon" style={{ color: textColor }}>
                  {openItems.includes(index) ? "−" : "+"}
                </span>
              </button>
              {openItems.includes(index) && (
                <div className="faq-answer" style={{ color: mutedTextColor }}>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
