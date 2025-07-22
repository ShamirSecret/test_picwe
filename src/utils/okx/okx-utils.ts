import { createHmacSignature } from "./crypto";

const secretKey = process.env.NEXT_PUBLIC_OKX_SECRET_KEY || ''

// Helper function to create pre-hash string
function createPreHash(timestamp: string, method: string, requestPath: string, params?: any): string {
  let queryString = '';
  
  if (method === 'GET' && params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    queryString = '?' + searchParams.toString();
  }
  
  if (method === 'POST' && params) {
    queryString = JSON.stringify(params);
  }
  
  return timestamp + method + requestPath + queryString;
}

// Helper function to create OKX API signature
export async function createOKXSignature(method: string, requestPath: string, params?: any) {
  const timestamp = new Date().toISOString().slice(0, -5) + 'Z';
  const message = createPreHash(timestamp, method, requestPath, params);
  const signature = await createHmacSignature(message, secretKey);
  
  return { signature, timestamp };
}
