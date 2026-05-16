import CryptoJS from 'crypto-js';

export interface AesKey extends CryptoJS.lib.WordArray {}

export interface RsaConfig {
  publicKey: string;
  privateKey?: string;
}

export interface EncryptInterceptorOptions {
  enabled?: boolean;
  publicKey?: string;
  privateKey?: string;
  headerName?: string;
}
