import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { generateAesKey, encryptBase64, decryptBase64, encryptWithAes, decryptWithAes } from '../core/crypto';
import { encryptWithRsa, decryptWithRsa, initRsaConfig } from '../core/jsencrypt';

export interface EncryptInterceptorOptions {
  enabled?: boolean;
  publicKey?: string;
  privateKey?: string;
  headerName?: string;
}

const DEFAULT_OPTIONS: Required<EncryptInterceptorOptions> = {
  enabled: true,
  publicKey: '',
  privateKey: '',
  headerName: 'encrypt-key'
};

export const setupEncryptInterceptors = (
  axiosInstance: AxiosInstance,
  options: EncryptInterceptorOptions = {}
): void => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  if (config.publicKey) {
    initRsaConfig({
      publicKey: config.publicKey,
      privateKey: config.privateKey
    });
  }

  axiosInstance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      if (!config.enabled) {
        return requestConfig;
      }

      const isEncrypt = requestConfig.headers?.isEncrypt === 'true';

      if (isEncrypt && (requestConfig.method === 'post' || requestConfig.method === 'put')) {
        const aesKey = generateAesKey();
        const encryptedAesKey = encryptWithRsa(encryptBase64(aesKey));

        if (encryptedAesKey) {
          requestConfig.headers[config.headerName] = encryptedAesKey;
          requestConfig.data =
            typeof requestConfig.data === 'object'
              ? encryptWithAes(JSON.stringify(requestConfig.data), aesKey)
              : encryptWithAes(requestConfig.data, aesKey);
        }
      }

      return requestConfig;
    },
    (error: any) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (!config.enabled) {
        return response;
      }

      const keyStr = response.headers[config.headerName];

      if (keyStr != null && keyStr !== '') {
        const data = response.data;
        const base64Str = decryptWithRsa(keyStr);

        if (base64Str) {
          const aesKey = decryptBase64(base64Str.toString());
          const decryptedData = decryptWithAes(data, aesKey);
          try {
            response.data = JSON.parse(decryptedData);
          } catch (e) {
            console.error('Failed to parse decrypted data:', e);
            response.data = decryptedData;
          }
        }
      }

      return response;
    },
    (error: any) => Promise.reject(error)
  );
};
