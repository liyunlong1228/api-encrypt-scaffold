import CryptoJS from 'crypto-js';

const generateRandomString = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const generateAesKey = (): CryptoJS.lib.WordArray => {
  return CryptoJS.enc.Utf8.parse(generateRandomString());
};

export const encryptBase64 = (str: CryptoJS.lib.WordArray): string => {
  return CryptoJS.enc.Base64.stringify(str);
};

export const decryptBase64 = (str: string): CryptoJS.lib.WordArray => {
  return CryptoJS.enc.Base64.parse(str);
};

export const encryptWithAes = (message: string, aesKey: CryptoJS.lib.WordArray): string => {
  const encrypted = CryptoJS.AES.encrypt(message, aesKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};

export const decryptWithAes = (message: string, aesKey: CryptoJS.lib.WordArray): string => {
  const decrypted = CryptoJS.AES.decrypt(message, aesKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
