"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { BybitWallet } from "@bybit-wallet/aptos-wallet-adapter";
import React from "react";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  // const wallets = [
  //   new OKXWallet(),
  //   new BitgetWallet(),
  //   new BybitWallet()
  // ];

  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    // 延迟加载钱包实例，防止初始化时自动弹窗
    setWallets([
      new OKXWallet(),
      new BitgetWallet(),
      new BybitWallet()
    ]);
  }, []);
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {

      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};