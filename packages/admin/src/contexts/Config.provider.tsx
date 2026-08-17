import { type ReactNode } from 'react';
import { ConfigContext, type ConfigFields } from './Config.context';

const devValues: ConfigFields = {
  auth: {
    authorityURL: import.meta.env.VITE_AUTHORITY_URL,
    clientID: import.meta.env.VITE_AUTH_CLIENT_ID
  },
  backend: {
    apiBase: import.meta.env.VITE_BACKEND_API_BASE_URL
  }
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ConfigContext.Provider value={devValues}>{children}</ConfigContext.Provider>;
};
