import React, { useEffect, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { showSuccessAlert } from "../../utils/SweetAlertUtils";

const ConnectButtons: React.FC = () => {
  const { isConnected } = useAccount();
  const wasConnected = useRef(isConnected);

  useEffect(() => {
    if (isConnected !== wasConnected.current) {
      showSuccessAlert(
        `Your wallet has been ${isConnected ? "connected" : "disconnected"} successfully.`,
      );
      wasConnected.current = isConnected;
    }
  }, [isConnected]);

  return <ConnectButton showBalance={false} accountStatus="address" />;
};

export default ConnectButtons;
