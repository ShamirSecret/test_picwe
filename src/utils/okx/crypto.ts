/**
 * Create HMAC-SHA256 signature using Web Crypto API
 * @param message The message to sign
 * @param secretKey The secret key for signing
 * @returns Promise<string> Base64 encoded signature
 */
export async function createHmacSignature(message: string, secretKey: string): Promise<string> {
  try {
    // Convert the secret key to Uint8Array
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const messageData = encoder.encode(message);

    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Sign the message
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);

    // Convert to base64
    return btoa(String.fromCharCode(...Array.from(new Uint8Array(signature))));
  } catch (error) {
    console.error('Error creating HMAC signature:', error);
    throw new Error('Failed to create signature');
  }
}

/**
 * Convert string to base64
 * @param str String to encode
 * @returns Base64 encoded string
 */
export function stringToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Convert base64 to string
 * @param base64 Base64 encoded string
 * @returns Decoded string
 */
export function base64ToString(base64: string): string {
  return decodeURIComponent(escape(atob(base64)));
} 