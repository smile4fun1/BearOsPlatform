'use client';

import { useRole, UserRole } from '@/lib/roleContext';
import { ChevronDown, Shield, Users, Building2, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function RoleSwitcher() {
  const { role, setRole, getRoleLabel } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles: { id: UserRole; icon: React.ReactNode; label: string }[] = [
    { id: 'internal_admin', icon: <Shield className="w-4 h-4 text-rose-400" />, label: 'Bear Admin' },
    { id: 'internal_rfe', icon: <UserCircle className="w-4 h-4 text-blue-400" />, label: 'Bear RFE' },
    { id: 'partner_qcom', icon: <Users className="w-4 h-4 text-emerald-400" />, label: 'Partner (Qcom)' },
    { id: 'customer_manager', icon: <Building2 className="w-4 h-4 text-purple-400" />, label: 'Customer' },
  ];

  const currentRole = roles.find(r => r.id === role) || roles[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors w-full border border-white/10 bg-white/5"
      >
        {currentRole.icon}
        <span className="text-sm font-medium text-gray-200 flex-1 text-left truncate">
          {currentRole.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0F1117] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
              Switch Persona
            </div>
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  role === r.id
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

