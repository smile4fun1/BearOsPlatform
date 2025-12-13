'use client';

import { useRole } from "@/lib/roleContext";
import { AdminPartnerView } from "@/components/partner/AdminPartnerView";
import { PartnerDashboard } from "@/components/partner/PartnerDashboard";
import { partners } from "@/lib/partnerData";
import { Footer } from "@/components/Footer";

export default function PartnerPage() {
  const { role } = useRole();

  if (role === 'internal_admin') {
    return (
      <div className="h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto w-full">
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-[1600px] mx-auto">
            <AdminPartnerView />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (role === 'partner_qcom') {
    // For demo purposes, we'll assign the first partner (Qcom) to this role
    const partner = partners.find(p => p.id === 'ptr-qcom');
    
    if (!partner) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-400">Configuration Error</h2>
            <p className="text-gray-600">Partner profile not found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen bg-gradient-to-b from-[#020511] via-[#040a1c] to-[#050814] flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto w-full">
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-[1600px] mx-auto">
            <PartnerDashboard partner={partner} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fallback for unauthorized roles
  return (
    <div className="flex items-center justify-center h-screen bg-[#020511]">
      <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 max-w-md">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-gray-400 mb-6">
          This portal is reserved for authorized Bear Robotics partners and administrators.
        </p>
        <div className="text-xs text-gray-500 uppercase tracking-widest">
          Current Role: {role}
        </div>
      </div>
      <Footer />
    </div>
  );
}
