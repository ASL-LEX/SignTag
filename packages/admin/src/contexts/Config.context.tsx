import { createContext, useContext } from 'react';

export interface ConfigFields {
  auth: {
    authorityURL: string;
    clientID: string;
  };
  backend: {
    apiBase: string;
  };
}

export const ConfigContext = createContext<ConfigFields>({} as ConfigFields);
export const useConfig = () => useContext(ConfigContext);
