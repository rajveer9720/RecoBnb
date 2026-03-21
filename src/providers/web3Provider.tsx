import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { walletConfig } from "../utils/ProviderUtils";
import {
  type AvatarComponent,
  type DisclaimerComponent,
  RainbowKitProvider,
  type Theme,
  lightTheme,
} from "@rainbow-me/rainbowkit";

import merge from "lodash.merge";

const queryClient = new QueryClient();

interface Web3ModalProviderProps {
  children: React.ReactNode;
}

export const Web3ModalProvider: React.FC<Web3ModalProviderProps> = ({
  children,
}) => {
  const myTheme = merge(lightTheme(), {
    colors: {
      accentColor: import.meta.env.VITE_APP_BUTTON_BG_COLOR || "",
      connectButtonText: import.meta.env.VITE_APP_BUTTON_TEXT_COLOR || "",
      connectButtonBackground: import.meta.env.VITE_APP_BUTTON_BG_COLOR || "",
    },
    radii: {
      connectButton: "6px",
    },
    fonts: {
      body: import.meta.env.VITE_APP_FONT_FAMILY,
    },
  } as Theme);

  const Disclaimer: DisclaimerComponent = ({ Text }) => (
    <Text>{import.meta.env.VITE_APP_TITLE}</Text>
  );
  const CustomAvatar: AvatarComponent = ({ size }) => {
    return (
      <img
        src={import.meta.env.VITE_APP_FAVICON}
        width={size}
        height={size}
        style={{ borderRadius: size }}
      />
    );
  };

  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={myTheme}
          avatar={CustomAvatar}
          appInfo={{
            learnMoreUrl: undefined,
            disclaimer: Disclaimer,
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
