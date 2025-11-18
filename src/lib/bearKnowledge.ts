/**
 * Comprehensive Bear Robotics Knowledge Base
 * For Ursa Minor AI Assistant Context
 */

export const BEAR_ROBOTICS_KNOWLEDGE = `
# Bear Robotics Company Overview

## Company Profile
- **Founded**: 2017 in Redwood City, California
- **Headquarters**: Seoul, South Korea & Silicon Valley, USA
- **Mission**: Transform the hospitality industry with innovative robotic solutions
- **Focus**: Service robotics for restaurants, hotels, and healthcare facilities

## Product Line

### Servi (Original Model)
- **Type**: Food service robot
- **Capacity**: Up to 60 lbs (27 kg)
- **Trays**: 3 large trays
- **Use Case**: Restaurant table service, food running
- **Navigation**: Autonomous with LIDAR + cameras
- **Battery**: 8-12 hour runtime
- **Charging**: Auto-docking

### Servi Lift
- **Type**: Elevated service robot
- **Special Feature**: Hydraulic lift mechanism
- **Height Adjustment**: 30-48 inches
- **Use Case**: Countertop delivery, bar service
- **Capacity**: 40 lbs (18 kg)

### Servi Plus
- **Type**: Enhanced capacity model
- **Capacity**: 80 lbs (36 kg)
- **Trays**: 4 large trays + 1 utility tray
- **Use Case**: Large venue service, high-volume operations
- **Features**: Enhanced stability, faster navigation

### Servi Suite
- **Type**: Hospitality robot
- **Use Case**: Hotel amenity delivery, room service
- **Features**: Secure compartments, call button interaction
- **Capacity**: 50 lbs (23 kg)

## Technical Specifications

### Navigation System
- **LIDAR**: 360° scanning at 10Hz
- **Cameras**: 6x RGB cameras for obstacle avoidance
- **Sensors**: Ultrasonic proximity sensors, cliff detection
- **SLAM**: Simultaneous Localization and Mapping
- **Path Planning**: Dynamic A* with real-time obstacle avoidance
- **Localization Accuracy**: ±2cm position, ±1° orientation

### Connectivity
- **WiFi**: 802.11ac (2.4GHz + 5GHz)
- **Cloud**: Bear Cloud API for fleet management
- **Updates**: OTA (Over-The-Air) firmware updates
- **Telemetry**: Real-time performance metrics streaming

### Safety Features
- **Emergency Stop**: Physical button + software kill switch
- **Obstacle Detection**: 360° coverage, 0.5-3m range
- **Speed Limiting**: Adaptive based on environment density
- **Audio Alerts**: Warning sounds for pedestrians
- **Collision Avoidance**: Predictive trajectory planning

## Operations Metrics

### Key Performance Indicators (KPIs)
- **Uptime Target**: 95%+ operational availability
- **Orders Per Shift**: 50-150 depending on facility
- **Avg Trip Time**: 45-180 seconds per delivery
- **Incidents Per 1K Jobs**: <2 target
- **NPS Score**: 70+ target
- **Energy Efficiency**: 15-25 kWh per shift

### Maintenance Schedule
- **Daily**: Battery check, tray cleaning
- **Weekly**: Sensor calibration, firmware updates
- **Monthly**: Deep cleaning, mechanical inspection
- **Quarterly**: LIDAR recalibration, safety audit

## Deployment Locations

### Active Facilities
1. **Seoul HQ Automation Lab** - R&D and testing (Seoul, South Korea)
2. **Silicon Valley Command** - US operations center (Mountain View, CA)
3. **Tokyo Robotics Studio** - APAC expansion hub (Tokyo, Japan)
4. **Seoul Servi Factory** - Manufacturing (Seoul, South Korea)
5. **Busan Pilot Cluster** - Beta deployment site (Busan, South Korea)
6. **Singapore Experience Hub** - Customer demos (Singapore)

### Target Markets
- **Hospitality**: Restaurants, cafes, hotels
- **Enterprise Dining**: Corporate cafeterias, airports
- **Healthcare**: Hospital meal delivery, medical supply transport
- **Stadiums**: Large venue food service
- **Korean Franchises**: Specialized Korean dining chains

## RFE (Robotics Field Engineer) Operations

### Diagnostic Tools
- **Dashboard Access**: Real-time robot status monitoring
- **Log Analysis**: System logs, error codes, event timelines
- **Sensor Diagnostics**: LIDAR health, camera calibration status
- **Battery Analytics**: Charge cycles, degradation tracking
- **Map Editor**: Environment mapping, no-go zones, waypoints

### Common Issues & Fixes
1. **Navigation Drift**: LIDAR recalibration
2. **Battery Drain**: Check sensor power consumption
3. **WiFi Dropouts**: Channel optimization, repeater placement
4. **Tray Sensor Failure**: Recalibrate weight sensors
5. **Slow Performance**: Clear cache, optimize map

### Emergency Protocols
- **Level 1 (Low)**: Non-critical warnings, log and monitor
- **Level 2 (Medium)**: Performance degradation, schedule maintenance
- **Level 3 (High)**: Service disruption, dispatch RFE within 6 hours
- **Level 4 (Critical)**: Safety concern, immediate shutdown and RFE dispatch

## Bear Universe Platform Features

### For Operators
- Real-time fleet monitoring
- KPI dashboards and analytics
- Alert management
- Robot parameter adjustment
- Command execution (with permissions)

### For RFEs
- Diagnostic tools and logs
- Map editing and waypoint management
- Live robot screen streaming
- Remote troubleshooting
- Maintenance scheduling

### For Executives
- Financial metrics (ARR, pipeline, margins)
- Deployment tracking
- Performance trends
- AI training progress
- Knowledge base access

## Bear AI Agents

### Ursa Minor (40B)
- **Role**: Interactive assistant
- **Capabilities**: Navigation, robot control, query answering
- **Permissions**: User-approved commands only

### Ursa Major (70B)
- **Role**: Fleet orchestrator
- **Capabilities**: Multi-agent task delegation, KPI analysis
- **Deployment**: Universe automation planners

### Aurora Bear Lore (120B)
- **Role**: Knowledge core
- **Capabilities**: Product info, partnerships, compliance
- **Deployment**: Customer copilots, executive briefings

## Commands & Navigation

### Navigation Commands
- "go to [page]" - Navigate to specific dashboard
- "show me robot [id]" - Display robot details
- "operations dashboard" - View live telemetry

### Query Commands
- "what's the uptime?" - Current fleet uptime
- "show me alerts" - Active incident alerts
- "facility status" - Per-facility breakdown

### Control Commands (Require Permission)
- "modify [robot] [parameter] [value]" - Adjust robot settings
- "execute [command]" - Run system commands
- "update firmware" - Trigger OTA updates

Remember: Always ask for user permission before executing any command that modifies robot state or system configuration.
`;

export const BEAR_CONTEXT_EXAMPLES = [
  {
    question: "What's our current fleet performance?",
    context: "Reference latest KPI data including uptime, orders served, and NPS scores.",
  },
  {
    question: "Show me robot c44e79",
    context: "Navigate to /robots/c44e79 to display detailed robot interface.",
  },
  {
    question: "How do I recalibrate LIDAR?",
    context: "Provide RFE instructions: 1) Access diagnostic panel, 2) Run calibration wizard, 3) Verify accuracy within ±1° tolerance.",
  },
  {
    question: "What robots are deployed in Seoul?",
    context: "Query operations dataset filtered by city='Seoul', list robot models and facilities.",
  },
];

