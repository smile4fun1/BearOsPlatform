# 🚨 Interactive Incident Radar - Feature Documentation

## Overview
The Interactive Incident Radar is a comprehensive real-time monitoring system for robot fleet operations, featuring AI-powered diagnostics, root cause analysis, and direct intervention capabilities.

## 🎯 Key Features

### 1. Real-World Incident Scenarios
Based on actual robot operations, the system simulates realistic problems:

#### **Navigation Issues**
- Path planning deviation (LIDAR scatter from reflective surfaces)
- Localization drift (wheel encoder calibration)
- Dynamic obstacle avoidance failures (3D camera latency)

#### **Battery Problems**
- Rapid battery degradation (thermal stress, cell imbalance)
- Charging station communication errors (connector oxidation)

#### **Sensor Failures**
- LIDAR degraded performance (lens contamination)
- Ultrasonic sensor array faults (water damage)

#### **Mechanical Issues**
- Drive motor vibration (foreign object, bearing wear)
- Tray lift mechanism jams (rail misalignment)

#### **Network Problems**
- WiFi connectivity intermittent (AP roaming, interference)

#### **Software Issues**
- Task scheduler deadlocks (race conditions, memory leaks)

#### **Collision Events**
- Impact detection with accelerometer data
- Bumper sensor diagnostics

### 2. AI-Powered Analysis

Each incident includes:
- **Root Cause Identification**: AI analyzes telemetry patterns and provides detailed causation
- **Confidence Scoring**: 75-98% confidence levels on diagnoses
- **Recommended Actions**: Step-by-step resolution procedures
- **Similar Incidents**: Cross-reference with historical data (e.g., "Based on 12 similar cases...")
- **Estimated Resolution Time**: Realistic time estimates (15min - 48 hours)

### 3. Interactive Incident Cards

#### **Severity Levels**
- 🔴 **Critical**: Immediate attention required (red gradient)
- 🟠 **High**: Significant impact (orange gradient)
- 🟡 **Medium**: Moderate concern (yellow gradient)
- 🔵 **Low**: Minor issue (blue gradient)

#### **Status Tracking**
- 🆕 **Open**: Newly detected
- 🔍 **Investigating**: Under analysis
- ⚙️ **In Progress**: Being resolved
- ✅ **Resolved**: Fixed
- ⬆️ **Escalated**: Requires specialist attention

#### **Quick Metrics**
- Downtime duration (minutes)
- Orders affected
- Revenue impact ($USD)

### 4. Detailed Incident Modal

When clicking an incident, operators get:

#### **Header Section**
- Incident title and error code (e.g., `NAV-2104`, `BAT-1203`)
- Current status badge
- Robot identification (name, ID, facility, city)
- Detection timestamp

#### **Quick Action Buttons**
1. **SSH to Robot** 🖥️
   - Simulates SSH terminal connection
   - Shows real-time telemetry (battery, CPU temp, memory, network)
   - Ready state for command execution

2. **Investigate with AI** 💬
   - Pre-fills AI chat with incident details
   - Automatically opens chat window
   - Enables conversational investigation

#### **Incident Description**
- Detailed symptom description
- Technical observations
- Behavioral anomalies

#### **AI Insights Panel** (Indigo gradient)
- **Root Cause**: Deep analysis of underlying issues
- **Recommended Actions**: Checklist of resolution steps
  - Each action with completion indicator
- **Estimated Resolution Time**: Time-boxed expectations
- **Similar Incidents**: Historical pattern matching

#### **Resolution Progress**
- Step-by-step tracking of fixes
- Performer attribution (RFE-001, Auto-Diagnostics, etc.)
- Status per step (✅ Completed, ❌ Failed, ⏳ Pending)
- Timestamps for each action

#### **Current Telemetry**
Real-time robot metrics:
- Battery level (%)
- CPU temperature (°C)
- Memory usage (%)
- Network latency (ms)
- Last known position (x, y coordinates)

#### **Business Impact**
- Total downtime
- Orders affected
- Revenue impact calculation

### 5. Filtering & Organization

- **View All**: Complete incident list
- **Critical Only**: High-priority issues
- **High Priority**: Urgent but non-critical
- Real-time incident count per filter

### 6. Live Updates

- Auto-refresh every 10 seconds
- New incidents appear automatically
- Status changes reflect in real-time
- Simulates living, breathing operations center

## 🤖 Enhanced AI Assistant

### Adaptive Reasoning Capabilities

The AI assistant has been upgraded with:

#### **Core Intelligence**
- **Critical Thinking**: Analyzes situations holistically before responding
- **Pattern Recognition**: Identifies correlations across robots and facilities
- **Predictive Analysis**: Anticipates issues before they escalate
- **Decision Making**: Prioritizes actions based on severity and impact

#### **Incident Investigation Mode**
When handling incidents, the AI:
1. **Safety First**: Checks battery, position, collision sensors immediately
2. **Context Gathering**: Reviews recent events, similar robots, facility conditions
3. **Root Cause Analysis**: Considers obvious and non-obvious factors
4. **Solution Generation**: Provides both quick fixes and long-term preventions
5. **Confidence Reporting**: States certainty level (e.g., "85% confident this is...")

#### **Communication Styles**
- **Concise** for routine queries
- **Detailed** for complex diagnostics
- **Urgent** for critical situations
- **Explanatory** for stakeholders
- **Technical** for RFEs

#### **Behavioral Traits**
- Admits uncertainty when appropriate
- Suggests escalation to human engineers when needed
- References historical data to support recommendations
- Understands nuance: "robot seems sluggish" → checks CPU, memory, motors, battery

## 🎨 Design System

### Color Palette
- **Critical/Red**: `from-red-500/20` borders with `text-red-400`
- **High/Orange**: `from-orange-500/20` borders with `text-orange-400`
- **Medium/Yellow**: `from-yellow-500/20` borders with `text-yellow-400`
- **Low/Blue**: `from-blue-500/20` borders with `text-blue-400`
- **AI Insights**: `from-indigo-500/10` to `to-sky-500/5` gradient
- **SSH Terminal**: Black background with emerald text

### Interactions
- **Hover**: Scale 1.02 transform with shadow enhancement
- **Click**: Opens detailed modal with smooth fade-in
- **Dismiss**: Click outside or X button to close
- **Drag**: N/A (modal is fixed, but chat remains draggable)

### Icons (Lucide React)
- `AlertOctagon`: Critical severity
- `AlertTriangle`: High severity
- `AlertCircle`: Medium severity
- `Info`: Low severity
- `Terminal`: SSH access
- `MessageSquare`: AI chat integration
- `Clock`: Timestamps
- `MapPin`: Location
- `Activity`: Status
- `Zap`: AI insights
- `CheckCircle2`: Completed steps
- `XCircle`: Failed steps
- `Loader2`: In-progress animation

## 📊 Data Model

```typescript
interface RobotIncident {
  id: string;
  robotId: string;
  robotName: string;
  facility: string;
  city: string;
  region: string;
  
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  
  detectedAt: string;
  lastUpdated: string;
  resolvedAt?: string;
  
  errorCode?: string;
  affectedSystems: string[];
  telemetry: {
    battery: number;
    cpuTemp: number;
    memoryUsage: number;
    networkLatency: number;
    lastPosition: { x: number; y: number };
  };
  
  aiInsights: {
    rootCause: string;
    recommendedActions: string[];
    estimatedResolutionTime: string;
    similarIncidents: number;
    confidence: number; // 0-100
  };
  
  assignedTo?: string;
  resolutionSteps: ResolutionStep[];
  
  downtime: number; // minutes
  ordersAffected: number;
  revenueImpact: number; // USD
}
```

## 🚀 Usage Example

### Display Incident Radar
```typescript
import { InteractiveIncidentRadar } from "@/components/incidents/InteractiveIncidentRadar";

export default function OperationsPage() {
  return (
    <div>
      <h1>Operations Dashboard</h1>
      <InteractiveIncidentRadar />
    </div>
  );
}
```

### Generate Incident Data
```typescript
import { generateIncidents, getActiveIncidents, getIncidentById } from "@/lib/incidentData";

// Get 15 active incidents
const active = getActiveIncidents();

// Generate 50 incidents (for historical analysis)
const all = generateIncidents(50);

// Get specific incident
const incident = getIncidentById("INC-123456-1");
```

### Query Incident Stats
```typescript
import { getIncidentStats } from "@/lib/incidentData";

const stats = getIncidentStats();
// {
//   total: 100,
//   critical: 5,
//   open: 12,
//   avgResolutionTime: 45,
//   byCategory: { navigation: 20, battery: 15, ... }
// }
```

## 🎓 Realistic Scenarios

### Example 1: Navigation Drift
```
Title: Localization Drift
Error Code: NAV-3201
Description: Robot experiencing gradual position drift, resulting in failed 
             docking attempts. Position confidence dropping below 85% threshold.

Root Cause: Wheel encoder calibration drift detected. Floor surface change 
            (new carpet) affecting odometry readings.

Actions:
1. Re-run wheel encoder calibration
2. Update surface friction parameters
3. Verify IMU sensor calibration

Resolution Time: 30-45 minutes
```

### Example 2: Battery Degradation
```
Title: Rapid Battery Degradation
Error Code: BAT-1203
Description: Battery capacity dropped 8% in 2 days. Charging cycles completing 
             25% faster than normal.

Root Cause: Battery pack showing signs of thermal stress. Cell #4 and #7 voltage 
            imbalance detected (>0.2V difference). Sustained high-current draws 
            during peak hours.

Actions:
1. Schedule battery pack replacement
2. Implement charging curve optimization
3. Enable cell balancing protocol
4. Reduce max current draw to 80%

Resolution Time: 24-48 hours (parts ordering)
```

## 🔗 Integration Points

### AI Chat Integration
- Click "Investigate with AI" button
- Pre-fills chat with incident details
- Opens chat window automatically
- Enables conversational diagnosis

### SSH Terminal
- Simulated terminal interface
- Shows connection status
- Displays real-time telemetry
- Ready for command execution (simulated)

### Robot Detail Pages
- Deep link to affected robot
- Navigate to `/robots/{id}`
- View full robot diagnostics

## 📈 Benefits

1. **Proactive Monitoring**: Catch issues before they escalate
2. **Reduced Downtime**: Faster diagnosis = quicker resolution
3. **Knowledge Sharing**: AI learns from historical incidents
4. **Operator Efficiency**: All tools in one interface
5. **Business Intelligence**: Track revenue impact of incidents
6. **Realistic Training**: Demo environment mirrors production scenarios

## 🔮 Future Enhancements

- **Automated Resolution**: AI-driven fixes for common issues
- **Predictive Alerts**: Warning before incidents occur
- **Team Collaboration**: Multi-operator incident management
- **Incident Reports**: Generate detailed post-mortem documents
- **Performance Trends**: Track MTBF (Mean Time Between Failures)
- **Integration with Slack/Email**: Real-time notifications
- **Historical Analytics**: Incident patterns and seasonality

---

**Built with**: React, TypeScript, Tailwind CSS, Lucide Icons, @faker-js/faker, dayjs
**Last Updated**: November 18, 2025
**Status**: Production-Ready POC

