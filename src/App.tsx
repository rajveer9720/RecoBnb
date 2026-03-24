import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import InvestmentPlans from "./components/InvestmentPlans";
import ReferralProgram from "./components/ReferralProgram";
import LeadershipProgram from "./components/LeadershipProgram";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./enhanced.css";
import { Web3ModalProvider } from "./providers/web3Provider";
import {
  ContractDataProvider,
  UserDataProvider,
} from "./components/Context/ContractDataContext";
import { useAccount } from "wagmi";
import { Toaster } from "react-hot-toast";

function AppContent() {
  const { address } = useAccount();

  const backgroundColor =
    import.meta.env.VITE_APP_BACKGROUND_COLOR || "#1e293b";
  document.body.style.backgroundColor = backgroundColor;

  return (
    <UserDataProvider userAddress={address ?? ""}>
      <div className="app">
        <Navigation />

        <main className="main-content">
          <section id="home">
            <Hero />
          </section>

          <section id="invest">
            <InvestmentPlans />
          </section>

          <section id="dashboard">
            <Dashboard />
          </section>

          <section id="leadership">
            <LeadershipProgram />
          </section>

          <section id="referrals">
            <ReferralProgram />
          </section>

          <section id="faq">
            <FAQ />
          </section>
        </main>

        <Footer />
        <Toaster />
      </div>
    </UserDataProvider>
  );
}

function App() {
  return (
    <Web3ModalProvider>
      <ContractDataProvider>
        <AppContent />
      </ContractDataProvider>
    </Web3ModalProvider>
  );
}

export default App;
