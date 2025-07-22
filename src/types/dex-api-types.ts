// OKX DEX API Types
export interface OKXQuoteParams {
  chainId: number;
  amount: string;
  toTokenAddress: string;
  fromTokenAddress: string;
  slippage?: number;
  userAddress?: string;
}

export interface OKXQuoteResponse {
  code: string;
  msg: string;
  data: Array<{
    chainId: string;
    fromTokenAddress: string;
    toTokenAddress: string;
    fromTokenAmount: string;
    toTokenAmount: string;
    priceImpact: string;
    gasEstimate: string;
    route: Array<{
      dex: string;
      path: Array<string>;
    }>;
  }>;
}

export interface OKXSwapParams {
  chainIndex?: string;
  chainId?: string;
  amount: string;
  swapMode?: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  slippage: string;
  userWalletAddress: string;
  swapReceiverAddress?: string;
  feePercent?: string;
  fromTokenReferrerWalletAddress?: string;
  toTokenReferrerWalletAddress?: string;
  positiveSlippagePercent?: string;
  positiveSlippageFeeAddress?: string;
  gasLimit?: string;
  gasLevel?: string;
  computeUnitPrice?: string;
  computeUnitLimit?: string;
  tips?: string;
  tipsReceiverAddress?: string;
  quoteId?: string;
}

export interface OKXSwapResponse {
  code: string;
  msg: string;
  data: Array<{
    routerResult: {
      chainId: string;
      chainIndex: string;
      dexRouterList: Array<{
        router: string;
        routerPercent: string;
        subRouterList: Array<{
          dexProtocol: Array<{
            dexName: string;
            percent: string;
          }>;
          fromToken: {
            decimal: string;
            isHoneyPot: boolean;
            taxRate: string;
            tokenContractAddress: string;
            tokenSymbol: string;
            tokenUnitPrice: string;
          };
          toToken: {
            decimal: string;
            isHoneyPot: boolean;
            taxRate: string;
            tokenContractAddress: string;
            tokenSymbol: string;
            tokenUnitPrice: string;
          };
        }>;
      }>;
      estimateGasFee: string;
      fromToken: {
        decimal: string;
        isHoneyPot: boolean;
        taxRate: string;
        tokenContractAddress: string;
        tokenSymbol: string;
        tokenUnitPrice: string;
      };
      fromTokenAmount: string;
      priceImpactPercentage: string;
      quoteCompareList: Array<{
        amountOut: string;
        dexLogo: string;
        dexName: string;
        tradeFee: string;
      }>;
      toToken: {
        decimal: string;
        isHoneyPot: boolean;
        taxRate: string;
        tokenContractAddress: string;
        tokenSymbol: string;
        tokenUnitPrice: string;
      };
      toTokenAmount: string;
      tradeFee: string;
    };
    tx: {
      signatureData?: Array<string>;
      from: string;
      gas: string;
      gasPrice: string;
      maxPriorityFeePerGas: string;
      to: string;
      value: string;
      maxSpendAmount?: string;
      minReceiveAmount: string;
      data: string;
      slippage: string;
    };
  }>;
}
// OKX DEX API Types
export interface OKXQuoteParams {
  chainId: number;
  amount: string;
  toTokenAddress: string;
  fromTokenAddress: string;
  slippage?: number;
  userAddress?: string;
}

export interface OKXQuoteResponse {
  code: string;
  msg: string;
  data: Array<{
    chainId: string;
    fromTokenAddress: string;
    toTokenAddress: string;
    fromTokenAmount: string;
    toTokenAmount: string;
    priceImpact: string;
    gasEstimate: string;
    route: Array<{
      dex: string;
      path: Array<string>;
    }>;
  }>;
}

// OKX Approve Transaction Types
export interface OKXApproveParams {
  chainIndex: string;
  chainId: string;
  tokenContractAddress: string;
  approveAmount: string;
}

export interface OKXApproveResponse {
  code: string;
  msg: string;
  data: Array<{
    data: string;
    dexContractAddress: string;
    gasLimit: string;
    gasPrice: string;
  }>;
}

export interface OKXSwapParams {
  chainIndex?: string;
  chainId?: string;
  amount: string;
  swapMode?: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  slippage: string;
  userWalletAddress: string;
  swapReceiverAddress?: string;
  feePercent?: string;
  fromTokenReferrerWalletAddress?: string;
  toTokenReferrerWalletAddress?: string;
  positiveSlippagePercent?: string;
  positiveSlippageFeeAddress?: string;
  gasLimit?: string;
  gasLevel?: string;
  computeUnitPrice?: string;
  computeUnitLimit?: string;
  tips?: string;
  tipsReceiverAddress?: string;
  quoteId?: string;
}

