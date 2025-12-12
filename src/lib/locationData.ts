import { robotFleet, Robot } from './robotData';

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  type: 'restaurant' | 'hotel' | 'hospital' | 'warehouse' | 'retail' | 'other';
  timezone: string;
  robotCount: number;
  robots: string[]; // Robot IDs
  isActive: boolean;
  primaryContact?: string;
  primaryEmail?: string;
}

// Mock user locations - In production, this would come from user account
export const userLocations: Location[] = [
  {
    id: 'loc-001',
    name: 'London Flagship Restaurant',
    address: '123 Oxford Street',
    city: 'London',
    country: 'United Kingdom',
    type: 'restaurant',
    timezone: 'Europe/London',
    robotCount: 4,
    robots: ['c44e79', 'a1b2c3', 'd5e6f7', 'g8h9i0'],
    isActive: true,
    primaryContact: 'James Wilson',
    primaryEmail: 'james.wilson@restaurant.com',
  },
  {
    id: 'loc-002',
    name: 'Manchester City Hotel',
    address: '45 Deansgate',
    city: 'Manchester',
    country: 'United Kingdom',
    type: 'hotel',
    timezone: 'Europe/London',
    robotCount: 3,
    robots: ['j1k2l3', 'm4n5o6', 'p7q8r9'],
    isActive: true,
    primaryContact: 'Emma Brown',
    primaryEmail: 'emma.brown@hotel.com',
  },
  {
    id: 'loc-003',
    name: 'Paris Distribution Center',
    address: '78 Avenue des Champs-Élysées',
    city: 'Paris',
    country: 'France',
    type: 'warehouse',
    timezone: 'Europe/Paris',
    robotCount: 2,
    robots: ['s1t2u3', 'v4w5x6'],
    isActive: true,
    primaryContact: 'Pierre Dubois',
    primaryEmail: 'pierre.dubois@warehouse.fr',
  },
];

// Get robots for a specific location
export function getRobotsForLocation(locationId: string): Robot[] {
  const location = userLocations.find(l => l.id === locationId);
  if (!location) return [];
  
  return robotFleet.filter(r => location.robots.includes(r.id));
}

// Get all robots for the current user (across all their locations)
export function getUserRobots(): Robot[] {
  const allRobotIds = userLocations.flatMap(l => l.robots);
  return robotFleet.filter(r => allRobotIds.includes(r.id));
}

// Get location by ID
export function getLocationById(id: string): Location | undefined {
  return userLocations.find(l => l.id === id);
}

// Get location for a robot
export function getLocationForRobot(robotId: string): Location | undefined {
  return userLocations.find(l => l.robots.includes(robotId));
}

// Location type icons/labels
export const locationTypeLabels: Record<Location['type'], string> = {
  restaurant: 'Restaurant',
  hotel: 'Hotel',
  hospital: 'Hospital',
  warehouse: 'Warehouse',
  retail: 'Retail Store',
  other: 'Other',
};

// Summary stats for user
export function getUserStats() {
  const robots = getUserRobots();
  const activeRobots = robots.filter(r => r.status === 'active' || r.status === 'idle');
  const issueRobots = robots.filter(r => r.status === 'error' || r.status === 'offline');
  const chargingRobots = robots.filter(r => r.status === 'charging');
  
  return {
    totalLocations: userLocations.length,
    totalRobots: robots.length,
    activeRobots: activeRobots.length,
    issueRobots: issueRobots.length,
    chargingRobots: chargingRobots.length,
    averageBattery: Math.round(robots.reduce((sum, r) => sum + r.battery, 0) / robots.length),
  };
}
