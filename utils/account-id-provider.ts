'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ValueContextType = {
  value: any;
  setValue: (value: any) => void;
};

const defaultValue: ValueContextType = {
  value: null, // Default value
  setValue: () => {}, // Placeholder function, will be replaced in provider
};

// Creating the context
const ValueContext = createContext<ValueContextType>(defaultValue);


type ValueProviderProps = {
    default: any;
  children: ReactNode;
};

const AccountIdProvider: React.FC<ValueProviderProps> = ({ default, children }: ValueProviderProps) => {
  const [value, setValue] = useState<any>(default);

  return (
    <ValueContext.Provider value={{ value, setValue }}>
      {children}
    </ValueContext.Provider>
  );
};

function useValue() {
  const context = useContext(ValueContext);
  if (context === undefined) {
    throw new Error('useValue must be used within a ValueProvider');
  }
  return context;
}

export { ValueContext, AccountIdProvider, useValue };