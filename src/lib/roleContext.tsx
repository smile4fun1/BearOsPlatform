'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'internal_admin' | 'internal_rfe' | 'partner_qcom' | 'customer_manager';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  getRoleLabel: (role: UserRole) => string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('internal_admin');

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'internal_admin': return 'Bear Internal (Admin)';
      case 'internal_rfe': return 'Bear RFE';
      case 'partner_qcom': return 'Partner (Qcom)';
      case 'customer_manager': return 'Customer (Manager)';
      default: return 'Unknown';
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, getRoleLabel }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (undefined === context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

