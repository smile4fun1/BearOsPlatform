import { Robot, robotFleet } from "./robotData";

export interface Partner {
  id: string;
  name: string;
  region: string;
  status: "Active" | "Pending" | "Inactive";
  joinedDate: string;
  contactPerson: string;
  email: string;
  contractType: "Enterprise" | "SME" | "Reseller";
  sites: PartnerSite[];
}

export interface PartnerSite {
  id: string;
  name: string;
  address: string;
  city: string;
  status: "Healthy" | "Attention" | "Critical";
  deployedRobots: string[]; // Robot IDs
}

// Generate sites based on robot fleet data to ensure consistency
const generatePartnerSites = (partnerPrefix: string, city: string, offset: number = 0): PartnerSite[] => {
  // Find robots in this city/region to assign
  const availableRobots = robotFleet.filter(r => r.city === city || r.region === "Europe" || r.region === "Americas");
  
  return [
    {
      id: `${partnerPrefix}-site-${1 + offset}`,
      name: `${city} Grand Hotel`,
      address: `123 Main St, ${city}`,
      city: city,
      status: "Healthy",
      deployedRobots: availableRobots.slice(0, 4).map(r => r.id)
    },
    {
      id: `${partnerPrefix}-site-${2 + offset}`,
      name: `${city} Tech Hub`,
      address: `45 Innovation Dr, ${city}`,
      city: city,
      status: "Attention",
      deployedRobots: availableRobots.slice(4, 8).map(r => r.id)
    }
  ];
};

export const partners: Partner[] = [
  {
    id: "ptr-qcom",
    name: "Qualcomm Services",
    region: "Global",
    status: "Active",
    joinedDate: "2023-04-15",
    contactPerson: "Sarah Connor",
    email: "sarah.c@qcom.com",
    contractType: "Enterprise",
    sites: [
      ...generatePartnerSites("qcom", "London", 0),
      ...generatePartnerSites("qcom", "San Jose", 2)
    ]
  },
  {
    id: "ptr-compass",
    name: "Compass Group",
    region: "Europe",
    status: "Active",
    joinedDate: "2024-01-10",
    contactPerson: "John Smith",
    email: "j.smith@compass-group.com",
    contractType: "Enterprise",
    sites: generatePartnerSites("compass", "Manchester")
  },
  {
    id: "ptr-sodexo",
    name: "Sodexo Live",
    region: "Americas",
    status: "Active",
    joinedDate: "2023-11-22",
    contactPerson: "Mike Johnson",
    email: "mike.j@sodexo.com",
    contractType: "Reseller",
    sites: generatePartnerSites("sodexo", "Chicago")
  },
  {
    id: "ptr-aramark",
    name: "Aramark",
    region: "APAC",
    status: "Pending",
    joinedDate: "2025-02-01",
    contactPerson: "David Kim",
    email: "d.kim@aramark.com",
    contractType: "SME",
    sites: []
  }
];

export function getPartnerById(id: string): Partner | undefined {
  return partners.find(p => p.id === id);
}

export function getPartnerStats(partnerId: string) {
  const partner = getPartnerById(partnerId);
  if (!partner) return null;

  const totalSites = partner.sites.length;
  const totalRobots = partner.sites.reduce((acc, site) => acc + site.deployedRobots.length, 0);
  const issues = partner.sites.filter(s => s.status !== "Healthy").length;

  return {
    totalSites,
    totalRobots,
    issues
  };
}

