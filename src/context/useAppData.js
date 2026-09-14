import { useContext } from 'react';
import { AppDataContext } from './AppContext';

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData debe ser utilizado dentro de un AppDataProvider');
  }
  return context;
};
