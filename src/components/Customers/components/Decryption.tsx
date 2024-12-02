// encryption.ts
import CryptoJS from "crypto-js";

// Decrypt function
export function decryptData(encryptedData: string): string {
  // Fetch and sanitize environment variables
  const key = '$asm-d9876-mkjhu&%4298fdjLI*IH##';
  const iv = '98%UI-64546-ny$$';

  if (!key || !iv) {
    throw new Error("Missing encryption key or IV from environment variables");
  }



  // Validate key and IV lengths (adjust as needed for AES-256 and AES block size)
  const paddedKey = key.padEnd(32, " "); // Ensure 32 bytes
  const paddedIv = iv.padEnd(16, " ");  // Ensure 16 bytes

  // Parse key and IV
  const keyBytes = CryptoJS.enc.Utf8.parse(paddedKey);
  const ivBytes = CryptoJS.enc.Utf8.parse(paddedIv);

  try {
    // Parse the encrypted data into a format the library can process
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
    });

    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(cipherParams, keyBytes, { iv: ivBytes });

    // Convert the decrypted data into a UTF-8 string
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    if (!plaintext) throw new Error("Decryption failed: empty result");

    return plaintext;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Decryption error:", error.message);
    } else {
      console.error("Decryption error:", error);
    }
    throw error;
  }
}
