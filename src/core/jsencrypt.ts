import JSEncrypt from 'jsencrypt';

interface RsaConfig {
  publicKey: string;
  privateKey?: string;
}

let rsaConfig: RsaConfig = {
  publicKey: '',
  privateKey: ''
};

export const initRsaConfig = (config: RsaConfig): void => {
  rsaConfig = { ...rsaConfig, ...config };
};

export const getRsaConfig = (): RsaConfig => {
  return rsaConfig;
};

export const encryptWithRsa = (txt: string): string | false => {
  if (!rsaConfig.publicKey) {
    console.error('RSA public key is not configured');
    return false;
  }
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(rsaConfig.publicKey);
  return encryptor.encrypt(txt);
};

export const decryptWithRsa = (txt: string): string | false => {
  if (!rsaConfig.privateKey) {
    console.error('RSA private key is not configured');
    return false;
  }
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(rsaConfig.privateKey);
  return encryptor.decrypt(txt);
};
