import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchContractData, fetchUserData } from "../../utils/infuraApi";
import type { ContractDataType, UserDataType } from "../../utils/interface";
interface ContractDataContextType {
  contractData: ContractDataType | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UserDataContextType {
  userData: UserDataType | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ContractDataContext = createContext<ContractDataContextType>({
  contractData: null,
  loading: false,
  error: null,
  refetch: async () => {},
});

const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  loading: false,
  error: null,
  refetch: async () => {},
});

export const ContractDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contractData, setContractData] = useState<ContractDataType | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadContractData = async () => {
    setLoading(true);
    try {
      const data = await fetchContractData();
      setContractData(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch contract data");
    }
    setLoading(false);
  };

  const refetch = async () => {
    await loadContractData();
  };

  useEffect(() => {
    loadContractData();
  }, []);

  return (
    <ContractDataContext.Provider
      value={{ contractData, loading, error, refetch }}
    >
      {children}
    </ContractDataContext.Provider>
  );
};
export const useContractData = () => {
  return useContext(ContractDataContext);
};

export const UserDataProvider: React.FC<{
  children: React.ReactNode;
  userAddress: string;
}> = ({ children, userAddress }) => {
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    if (!userAddress) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchUserData(userAddress);
      setUserData(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch user data");
    }
    setLoading(false);
  };

  const refetch = async () => {
    if (userAddress) {
      await loadUserData();
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userAddress]);

  return (
    <UserDataContext.Provider value={{ userData, loading, error, refetch }}>
      {children}
    </UserDataContext.Provider>
  );
};
export const useUserData = () => {
  return useContext(UserDataContext);
};
