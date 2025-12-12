export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
}

export const faqData: FAQItem[] = [
  // General
  {
    id: 1,
    category: 'general',
    question: 'What robots does Bear Robotics make?',
    answer: 'Bear Robotics makes two main robots for the hospitality industry: Servi Plus, a food service robot designed for restaurants, and Carti 100, a delivery robot for various indoor environments. Both robots help businesses operate more efficiently by automating routine delivery tasks.',
    keywords: ['about', 'robots', 'what is', 'servi plus', 'carti 100', 'models']
  },
  {
    id: 2,
    category: 'general',
    question: 'How do I turn on my robot?',
    answer: 'First, make sure the robot is charged by placing it on the charging station for at least 30 minutes.\n\nThe power button is located on the back or side of the robot base.\n\nPress and hold the power button for 3-5 seconds until you hear a sound and see the screen light up.\n\nWait about 1 minute for the robot to fully start up before using it.',
    keywords: ['power on', 'start', 'turn on', 'boot', 'startup']
  },
  {
    id: 3,
    category: 'general',
    question: 'How do I turn off my robot at the end of the day?',
    answer: 'The easiest way is to simply place the robot on its charging station - it will automatically go into charging mode.\n\nIf you need to fully power off, look for the power menu on the screen (usually under settings or by tapping the power icon), then select "Power Off" or "Shutdown".\n\nWait for the screen to turn off completely before moving the robot.',
    keywords: ['shutdown', 'power off', 'turn off', 'stop', 'end of day']
  },
  {
    id: 4,
    category: 'general',
    question: 'How much weight can the robot carry?',
    answer: 'Servi Plus can carry up to 40kg (88 lbs) total across all its trays. Each individual tray can hold about 10-13kg (22-29 lbs).\n\nCarti 100 can carry up to 100kg (220 lbs) in its main compartment.\n\nAlways distribute weight evenly and never exceed these limits. If overloaded, the robot may move slower or show a warning message.',
    keywords: ['capacity', 'weight', 'load', 'how much', 'carry', 'limits']
  },
  // Power
  {
    id: 6,
    category: 'power',
    question: 'My robot won\'t charge. What should I do?',
    answer: 'If your robot won\'t charge, try these steps:\n\n1) Check that the charging station is plugged in and the power indicator light is on.\n\n2) Inspect charging contacts on both robot and station for dirt or debris - clean with a dry cloth.\n\n3) Ensure the robot is properly aligned with the charging station (you should hear a click).\n\n4) Check the wall outlet with another device to confirm power.\n\n5) Look for error messages on the robot screen.\n\n6) Try manually positioning the robot on the charger.\n\nIf problem persists, the charging contacts or battery may need service.',
    keywords: ['charging', 'won\'t charge', 'not charging', 'battery', 'charger']
  },
  {
    id: 7,
    category: 'power',
    question: 'How long does it take to fully charge the battery?',
    answer: 'A full charge from 0% to 100% typically takes 4-6 hours for both Servi Plus and Carti 100.\n\nBoth robots use intelligent charging: they charge quickly to 80% (about 2-3 hours) for rapid return to service, then slowly charge the final 20% to preserve battery life.\n\nFor optimal battery health, we recommend charging overnight. The robots can operate while charging up to 20%, making them suitable for continuous operation during slow periods.',
    keywords: ['charging time', 'how long', 'battery time', 'charge duration']
  },
  // Operation
  {
    id: 12,
    category: 'operation',
    question: 'The robot keeps bumping into things. Why?',
    answer: 'If your robot is bumping into objects, the sensors may be dirty. Clean all sensors on the front, sides, and bottom of the robot with a soft, dry cloth.\n\nMake sure there\'s good lighting in your space - sensors don\'t work well in very dark areas.\n\nAlso check if you\'ve moved furniture recently - the robot may need help relocalizing. Try positioning it near a QR code marker to help it reorient.\n\nIf bumping continues after cleaning sensors and relocalizing, contact support.',
    keywords: ['bumping', 'collision', 'hitting', 'crashes', 'obstacles', 'sensors']
  },
  {
    id: 33,
    category: 'operation',
    question: 'The robot seems confused about its location. What are QR codes and how do they help?',
    answer: 'QR codes are special markers placed around your space that help the robot know exactly where it is.\n\nIf your robot seems lost or confused (spinning in circles, not going to the right places, or showing location errors), try moving it close to one of these QR code markers. The robot will scan the code and instantly know its position again.\n\nThese codes are usually placed on walls or pillars around your facility at eye-level.\n\nIf you can\'t find your QR codes or they seem damaged or covered, contact support for assistance.',
    keywords: ['QR code', 'lost', 'location', 'confused', 'localization', 'position', 'markers', 'spinning']
  },
  // Connectivity
  {
    id: 17,
    category: 'connectivity',
    question: 'How do I connect the robot to WiFi?',
    answer: 'To connect to WiFi:\n\n1) On the robot screen, tap Settings, then Network, then WiFi.\n\n2) Make sure WiFi is turned ON.\n\n3) Wait for the list of networks to appear.\n\n4) Tap on your facility\'s WiFi network name.\n\n5) Type in your WiFi password carefully (it\'s case-sensitive).\n\n6) Tap Connect and wait for a checkmark.\n\n7) Look for the WiFi icon at the top of the screen - it should show signal bars.\n\nIf you have trouble connecting, ask your IT person for help with the password.',
    keywords: ['wifi', 'wireless', 'connect', 'network', 'internet', 'setup']
  },
  // Troubleshooting
  {
    id: 27,
    category: 'troubleshooting',
    question: 'The robot is showing an error message. What should I do?',
    answer: 'When you see an error message:\n\n1) Write down or take a photo of the exact error code and message.\n\n2) Try restarting the robot - hold the power button for 10 seconds until it shuts off, wait 30 seconds, then power it back on.\n\n3) If the error comes back, note when it happens (moving, charging, idle, etc.).\n\n4) Contact support with the error code and information about when it occurs.\n\nDon\'t try to fix advanced settings yourself as this can make the problem worse.',
    keywords: ['error', 'error message', 'error code', 'problem', 'issue']
  },
  {
    id: 32,
    category: 'troubleshooting',
    question: 'Where can I find my robot\'s serial number?',
    answer: 'The serial number is located on a label on the bottom of the robot base. You may need to carefully tilt the robot or place it on its side to see it.\n\nThe serial number usually starts with letters followed by numbers (example: SERVI-2023-1234).\n\nYou can also find it in the robot\'s settings: Go to Settings > About > Robot Information.\n\nWrite down your serial number and keep it handy - you\'ll need it when contacting support or ordering parts.',
    keywords: ['serial number', 'model number', 'robot id', 'identification']
  }
];

export const categories = [
  { id: 'general', label: 'Getting Started', description: 'Basic information about your robot' },
  { id: 'power', label: 'Power & Charging', description: 'Battery and charging help' },
  { id: 'operation', label: 'Daily Operations', description: 'Common usage tips' },
  { id: 'cleaning', label: 'Cleaning & Care', description: 'Maintenance guidelines' },
  { id: 'connectivity', label: 'Connectivity', description: 'WiFi and network setup' },
  { id: 'troubleshooting', label: 'Troubleshooting', description: 'Fix common issues' },
];

export const BEAR_ROBOTICS_KNOWLEDGE = `
BEAR ROBOTICS KNOWLEDGE BASE
===========================

MODELS & SPECS
-------------
Servi Plus:
- Heavy-duty service robot
- 40kg payload capacity (10-13kg per tray)
- 4 adjustable trays + bus tub
- 12+ hours battery life
- Auto-return to charger
- Multi-robot collaboration enabled
- Use cases: Food running, bussing, hosting, drinks service

Carti 100:
- Autonomous Material Handling (AMR)
- 100kg payload capacity
- Customizable top modules (shelves, bin, conveyor)
- Warehouse & logistics optimization
- Narrow aisle navigation
- Integration with WMS systems

CHARGING & POWER
---------------
- Charge time: 4-6 hours (0-100%)
- Quick charge: 2-3 hours (0-80%)
- Recommended: Charge overnight
- Behavior: Auto-docks when idle or low battery (<20%)
- Troubleshooting: Clean contacts if not charging. Check wall power.

NAVIGATION & SENSORS
-------------------
- LIDAR: Primary navigation sensor (360 degree view)
- 3D Cameras: Obstacle avoidance and depth perception
- Cliff Sensors: Prevents falling down stairs/ledges
- QR Codes: Used for localization recovery if lost
- Issues: Keep sensors clean. Ensure good lighting. Don't block QR codes.

CONNECTIVITY
-----------
- Requires stable WiFi (2.4GHz or 5GHz)
- WPA2-Personal or Enterprise supported
- Static IP recommended for enterprise fleets
- Port 443/80 outbound access required
- Error handling: Check signal strength bars. Verify SSID/Password.

MAINTENANCE
----------
- Daily: Clean trays, wipe sensors with microfiber cloth
- Weekly: Inspect wheels for debris/hair
- Monthly: Deep clean chassis
- Safety: Don't spray water directly on sensors or screens
`;