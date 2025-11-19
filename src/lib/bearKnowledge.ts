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

### Servi Plus
- **Type**: Enhanced food service robot
- **Capacity**: 88 lbs (40 kg)
- **Trays**: 4 large trays
- **Speed**: 1.2 m/s
- **Use Case**: High-volume restaurant operations
- **Features**: Enhanced payload, faster navigation, longer battery life (14-18 hours)

### Carti 100
- **Type**: Multi-purpose autonomous cart
- **Capacity**: 220 lbs (100 kg)
- **Speed**: 1.5 m/s
- **Use Case**: Staff aid (cleaning supplies, tools), light warehousing
- **Features**: Flatbed design, industrial durability, 10-14 hour runtime
- **Dimensions**: 600×800×1100 mm

### Carti 600
- **Type**: Heavy-duty industrial robot
- **Capacity**: 1320 lbs (600 kg)
- **Speed**: 1.0 m/s
- **Use Case**: Warehouse operations, pallet movement, heavy goods transport
- **Features**: Reinforced chassis, advanced load sensors, 8-12 hour runtime
- **Dimensions**: 800×1200×1400 mm
- **Weight**: 180 kg

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

## Monitored Facilities (in Bear Universe Platform)

### Americas Region
1. **Redwood City HQ** - Primary operations center (California, USA)
2. **Los Angeles Distribution** - West coast logistics (California, USA)

### Europe Region
3. **London Service Hub** - UK operations (London, UK)
4. **Paris Operations** - France operations (Paris, France)
5. **Berlin Tech Center** - Germany operations (Berlin, Germany)

### APAC Region
6. **Seoul Operations Center** - Korea headquarters (Seoul, South Korea)
7. **Tokyo Service Center** - Japan operations (Tokyo, Japan)
8. **Singapore Hub** - Singapore operations (Singapore)

### Deployment Verticals
- **Restaurant Service**: Food delivery, bussing (Servi Plus)
- **Staff Operations**: Cleaning, tools, supplies (Carti 100)
- **Warehousing**: Heavy loads, pallets, logistics (Carti 600)
- **Healthcare**: Hospital meal/supply delivery (Servi Plus, Carti 100)

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

## Bear Universe Platform Overview

**Purpose**: Centralized operations platform for monitoring and managing Bear Robotics fleets in real-time. Designed for field engineers, operations teams, and facility managers.

**Core Value Propositions**:
- Monitor 100+ robots across 8 global facilities in real-time
- Diagnose incidents with AI-powered root cause analysis
- Reduce downtime through predictive maintenance alerts
- Optimize fleet performance with actionable insights
- Enable remote troubleshooting for field engineers

### For Operations Teams
- **Real-time Fleet Monitoring**: Live telemetry from all robots
- **Incident Radar**: Priority-sorted incidents with severity levels
- **KPI Dashboards**: Uptime, deliveries, performance metrics
- **Alert Management**: Proactive notifications for issues
- **Performance Analytics**: Historical trends and comparisons

### For Field Engineers (RFE)
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

