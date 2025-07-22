import config from '@/config';
import request from '@/utils/request';
import { OKXApproveParams, OKXApproveResponse, OKXQuoteParams, OKXQuoteResponse, OKXSwapParams, OKXSwapResponse } from '../types/dex-api-types';
import { createOKXSignature } from '../utils/okx/okx-utils';

export function getEventsFromChain(accountAddress: string, eventsType: string, params: any) {
  return request(`${config.CUSTOMFULLNODE}/accounts/${accountAddress}/events/${eventsType}/minted_weusd_events`, {
    method: 'get',
    params
  })
}


/**
 * https://docs.mosaic.ag/swap-integration/editor
 * @param srcAsset
 * @param dstAsset
 * @param amount
 */
export function swapAPI(params) {
  // Attempt to get the API key in multiple ways
  let apiKey = process.env.NEXT_PUBLIC_XAPIKEY || process.env.XAPIKEY;
  
  // Log debugging information
  console.log('Environment variable status:', { 
    hasNextPublicKey: !!process.env.NEXT_PUBLIC_XAPIKEY,
    hasXapiKey: !!process.env.XAPIKEY,
    finalApiKey: !!apiKey
  });
  
  if (!apiKey) {
    console.error('API key not found, please check Vercel environment variable settings');
    throw new Error('API key not found, please check Vercel environment variable settings');
  }
  
  return request(`https://api.mosaic.ag/v1/quote`, {
    method: 'get',
    params,
    headers: {
      'x-api-key': apiKey,
    }
  })
}
// OKX API Configuration
const OKX_API_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_OKX_API_KEY,
  secretKey: process.env.NEXT_PUBLIC_OKX_SECRET_KEY,
  passphrase: process.env.NEXT_PUBLIC_OKX_PASSPHRASE || '$Testingokx99',
  baseUrl: 'https://web3.okx.com'
};
/**
 * Get quote from OKX DEX Aggregator
 * @param params Quote parameters
 * @returns Promise with quote data
 */
export async function getOKXQuote(params: OKXQuoteParams): Promise<OKXQuoteResponse> {
  const { signature, timestamp } = await createOKXSignature('GET', '/api/v5/dex/aggregator/quote', params);
  
  const headers = {
    'OK-ACCESS-KEY': OKX_API_CONFIG.apiKey,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': OKX_API_CONFIG.passphrase,
    'Content-Type': 'application/json'
  };

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });

  return request(`${OKX_API_CONFIG.baseUrl}/api/v5/dex/aggregator/quote?${queryParams.toString()}`, {
    method: 'GET',
    headers
  });
}

/**
 * Get approve transaction data from OKX DEX Aggregator
 * @param params Approve parameters
 * @returns Promise with approve transaction data
 */
export async function getOKXApproveTransaction(params: OKXApproveParams): Promise<OKXApproveResponse> {
  const { signature, timestamp } = await createOKXSignature('GET', '/api/v5/dex/aggregator/approve-transaction', params);
  
  const headers = {
    'OK-ACCESS-KEY': OKX_API_CONFIG.apiKey,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': OKX_API_CONFIG.passphrase,
    'Content-Type': 'application/json'
  };

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  return request(`${OKX_API_CONFIG.baseUrl}/api/v5/dex/aggregator/approve-transaction?${queryParams.toString()}`, {
    method: 'GET',
    headers
  });
}

/**
 * Execute swap on OKX DEX Aggregator
 * @param params Swap parameters
 * @returns Promise with swap transaction data
 */
export async function executeOKXSwap(params: OKXSwapParams): Promise<OKXSwapResponse> {
  const { signature, timestamp } = await createOKXSignature('GET', '/api/v5/dex/aggregator/swap', params);
  
  const headers = {
    'OK-ACCESS-KEY': OKX_API_CONFIG.apiKey,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': OKX_API_CONFIG.passphrase,
    'Content-Type': 'application/json'
  };

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  return request(`${OKX_API_CONFIG.baseUrl}/api/v5/dex/aggregator/swap?${queryParams.toString()}`, {
    method: 'GET',
    headers
  });
}
