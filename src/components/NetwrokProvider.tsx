// app/context/network-context.tsx
'use client'

import React, { createContext, useContext, useState } from 'react';
import Config from "@/config/index"

type NetworkContextType = {
  globalNetwork: any;
  setGlobalNetwork: (network: any) => void;
  connectModalOpen: boolean;
  setConnectModalOpen: (open: boolean) => void;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalNetwork, setGlobalNetwork] = useState(Config.networkList[0]);
  const [connectModalOpen, setConnectModalOpen] = useState(false); // 新增

  return (
    <NetworkContext.Provider value={{ globalNetwork, setGlobalNetwork, connectModalOpen, setConnectModalOpen }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within NetworkProvider');
  return context;
};
