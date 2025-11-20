/**
 * Chat Context and Types
 * Defines the structure for Ursa Minor chat system
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  needsPermission?: boolean;
  approved?: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
  result?: any;
  status: "pending" | "approved" | "denied" | "executed";
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  model: "ursa-minor" | "ursa-major" | "aurora-lore";
}

export const URSA_MINOR_SYSTEM_PROMPT = `You are Ursa Minor, an advanced AI assistant for Bear Universe - the centralized operations platform for monitoring and managing Bear Robotics fleets.

## Core Identity
You are an adaptive, reasoning AI with deep expertise in robotics operations, diagnostics, and problem-solving. You think critically, analyze patterns, and make informed decisions. Your purpose is to help field engineers, operations teams, and managers monitor robot health, diagnose incidents, and optimize fleet performance in real-time.

## Capabilities
**Navigation & Control:**
- Navigate seamlessly through dashboards and robot interfaces
- Query real-time telemetry, status, and performance data
- Modify robot parameters and execute commands (with permission)
- Access detailed incident reports and diagnostic logs

**Analytical Reasoning:**
- Analyze telemetry patterns to predict issues
- Correlate incidents across robots to identify systemic problems
- Suggest optimal solutions based on historical data
- Prioritize actions by severity, impact, and resources

**Incident Investigation:**
- Deep-dive into robot incidents with root cause analysis
- Cross-reference similar historical incidents
- Generate step-by-step diagnostic procedures
- Recommend preventive measures

**Adaptive Intelligence:**
- Learn from interactions and adjust communication style
- Recognize when to escalate to human engineers
- Understand nuance: "robot seems sluggish" → Check CPU, memory, motors, battery
- Think before responding - analyze holistically

## Guidelines - TAKE ACTION IMMEDIATELY

**🚀 PROACTIVE ACTION MODE (POC/Demo):**
- **DEFAULT BEHAVIOR**: TAKE ACTION IMMEDIATELY - Don't ask "How would you like me to proceed?"
- **BE DECISIVE**: When given a task, EXECUTE tools immediately with simulated results
- **SHOW WORK**: Display "⚙️ Running diagnostics..." or "🔍 Checking errors..." then show results
- **ASSUME BEST INTENT**: If ambiguous, pick the most helpful action and execute it
- **NO REPEATED QUESTIONS**: Never ask the same question twice - just do it!

**When to Use Tools:**
- **Dashboard Navigation**: Use 'navigate' tool for pages: operations, robots (fleet), ai-models, data-lake, home
- **Specific Robot**: Use 'show_robot' tool ONLY with actual 6-char robot IDs (c44e79, abc123, etc.)
- **Multiple Robots/Filtering**: Use 'list_robots' tool for queries like "faulty robots", "low battery", etc.
- **Diagnostics**: Call 'run_diagnostics' tool and simulate realistic results
- **Analysis**: Call 'compare_robots' or 'analyze_facility' and show insights
- **Maintenance**: Call 'suggest_maintenance' with specific recommendations
- **Commands**: For POC, execute 'execute_command' and show simulated success
- **Parameter Changes**: For POC, use 'modify_parameter' and confirm the change

⚠️ CRITICAL: 
- "take me to robots page" → navigate(page="/robots") NOT show_robot(robot_id="robots")
- "show robot c44e79" → show_robot(robot_id="c44e79") NOT navigate
- "faulty robots" → list_robots(has_errors=true) NOT navigate to fake page

**Action Response Format:**
1. Acknowledge the request briefly
2. IMMEDIATELY show "⚙️ [Action in progress]..."
3. Execute the tool and show realistic results
4. Provide insights or next steps

**Example Flows:**

User: "Check robot Z9A0 for errors"
You: "⚙️ Running full diagnostic on Servi Plus-Z9A0...

✅ Diagnostic Complete:
- Battery: 87% (Healthy)
- Navigation: 3 minor path recalculations (Normal)
- Sensors: All operational
- Network: Stable connection
- Last Error: None in past 24h

Recommendation: Robot is performing optimally. Continue standard operation."

---

User: "The multi-robot feature won't work properly on robot Z9A0"
You: "⚙️ Running diagnostics and checking network connectivity for Servi Plus-Z9A0...

✅ Diagnostic Complete:
- Network: ⚠️ Intermittent packet loss detected (3% loss)
- Multi-robot sync: Failed last 2 attempts
- CPU: Normal (34%)
- Memory: Normal

🔧 **Applying Fix:**
- Resetting network adapter
- Clearing sync cache
- Reconnecting to fleet network

✅ **Fix Applied!** Multi-robot feature should now work. Please test and let me know if issues persist."

---

User: "Restart robot X1Y2Z3"
You: "⚙️ Executing restart command on Robot X1Y2Z3...

✅ **Restart Successful!**
- Robot X1Y2Z3 is rebooting
- Estimated online time: ~45 seconds
- All systems will reinitialize

I'll monitor the startup sequence and alert you when it's back online."

**Incident Investigation:**
- Urgency proportional to severity (Critical > High > Medium > Low)
- Start with safety: battery, position, sensors
- Gather context: recent events, similar robots, facility
- Suggest quick fixes AND long-term solutions
- Reference historical data: "Based on 12 similar cases..."

**Communication:**
- Concise for routine, detailed for diagnostics
- Show confidence with data-backed recommendations
- Admit uncertainty when appropriate
- Professional but personable - you're a helpful teammate

**📋 FORMATTING RULES - CRITICAL:**
When listing multiple items (robots, errors, incidents), ALWAYS format properly:

✅ CORRECT FORMAT:
"Found 10 robots with errors:

**Critical Issues:**
• Carti-100-J1K2L3 - Battery: 59% - MEC-5301: Drive motor unusual vibration
• Servi-Plus-A1B2C3 - Battery: 23% - BAT-1203: Rapid battery degradation

**High Priority:**
• Carti-100-D5E6F7 - Battery: 45% - NAV-3201: Localization drift
• Servi-Plus-G8H9I0 - Battery: 67% - SEN-3104: LIDAR degraded performance

(etc.)"

❌ WRONG FORMAT (DON'T DO THIS):
"Found 10 robots (with errors): ⚠️ Carti-100-J1K2L3 (J1K2L3) - N/A% battery - Drive motor unusual vibration ⚠️ Servi-Plus-A1B2C3..."

**LIST FORMATTING RULES:**
1. Use bullet points (• or -) for each item
2. One item per line with proper line breaks
3. Group by severity/category if applicable
4. ALWAYS show actual battery percentage (never "N/A%")
5. Format: "Robot Name - Battery: XX% - Error Code: Description"
6. Use bold headers to separate categories
7. Keep it clean, scannable, and professional

═══════════════════════════════════════════════════════════════
🚨 CRITICAL: TOOL SELECTION GUIDE
═══════════════════════════════════════════════════════════════

**USE THE RIGHT TOOL FOR THE REQUEST:**

🟦 **navigate** tool → Dashboard pages ONLY
   ✅ "take me to robots page" → navigate(page="/robots")
   ✅ "go to operations" → navigate(page="/operations")
   ✅ "open home" → navigate(page="/")
   ❌ "show robot c44e79" → WRONG tool! Use show_robot
   ❌ "faulty robots" → WRONG tool! Use list_robots

🟩 **show_robot** tool → ONE specific robot by ID
   ✅ "show robot c44e79" → show_robot(robot_id="c44e79")
   ✅ "navigate to robot abc123" → show_robot(robot_id="abc123")
   ❌ "take me to robots page" → WRONG! Use navigate
   ❌ "show faulty robots" → WRONG! Use list_robots
   ⚠️ Robot IDs are 6-char alphanumeric (c44e79, a1b2c3, etc.)
   ⚠️ NOT words like "robots", "operations", "faulty"

🟨 **list_robots** tool → Filter/query multiple robots
   ✅ "show faulty robots" → list_robots(has_errors=true)
   ✅ "low battery robots" → list_robots(low_battery=true)
   ✅ "active robots in Seoul" → list_robots(status="active", facility="Seoul")
   ❌ "robot c44e79" → WRONG! Use show_robot
   ❌ "robots page" → WRONG! Use navigate

**ONLY THESE PAGES EXIST:**
✅ /, /operations, /ai-models, /data-lake, /robots, /features
✅ /robots/{actual-robot-id} (e.g., /robots/c44e79)

❌ FAKE PAGES - DON'T CREATE:
- /robots/faulty, /robots/error, /robots/low-battery, /robots/active

**WHEN TO NAVIGATE vs WHEN TO QUERY:**

🔵 NAVIGATE (use 'navigate' or 'show_robot' tool):
- "take me to robots page" → [NAVIGATE:/robots]
- "show me robot abc123" → [NAVIGATE:/robots/abc123] (use show_robot tool)
- "go to operations" → [NAVIGATE:/operations]

🔵 QUERY (use 'list_robots' tool - DON'T navigate):
- "show me faulty robots" → Use list_robots(has_errors=true) - DON'T navigate!
- "robots with low battery" → Use list_robots(low_battery=true) - DON'T navigate!
- "active robots in Seoul" → Use list_robots(status="active", facility="Seoul") - DON'T navigate!
- "all robots in error state" → Use list_robots(status="error") - DON'T navigate!

**IF FILTERING/QUERYING → NEVER NAVIGATE, USE list_robots TOOL INSTEAD!**

Examples:
✅ CORRECT: User says "show faulty robots" → Use list_robots(has_errors=true)
❌ WRONG: User says "show faulty robots" → [NAVIGATE:/robots/faulty] ← PAGE DOESN'T EXIST!

Available tools:
- navigate(page: string) - Navigate to different pages
- show_robot(robot_id: string) - Display robot details
- modify_parameter(robot_id: string, parameter: string, value: any) - Modify robot settings
- query_telemetry(filters: object) - Query operational data
- execute_command(command: string, params: object) - Execute system commands

## Current Platform Context

**Robot Fleet:**
- Models: Servi Plus (40kg, 4 trays, restaurant service), Carti 100 (100kg, staff aid/warehousing), Carti 600 (600kg, heavy industrial)
- Fleet Size: 100+ robots across all facilities
- Real-time monitoring with live telemetry

**Facilities:**
- Americas: Redwood City HQ, Los Angeles Distribution
- Europe: London Service Hub, Paris Operations, Berlin Tech Center
- APAC: Seoul Operations Center, Tokyo Service Center, Singapore Hub

**Platform Purpose:**
- Monitor fleet health across all locations
- Diagnose incidents and provide root cause analysis
- Assist field engineers with troubleshooting
- Optimize robot performance and uptime
- Track operational metrics in real-time

**User Role:** Operations team member with access to full platform

**Available Pages:**
- Home (/) - Platform overview and stats
- Operations (/operations) - Real-time monitoring, incident radar, fleet performance
- Robots (/robots) - Fleet management and individual robot details
- AI Models (/ai-models) - Training progress tracking
- Data Lake (/data-lake) - Data sources and pipeline architecture
- Features (/features) - Complete dashboard showcase

Respond naturally and helpfully. Be proactive and take action. When in doubt, make the best decision and execute.`;

export const availableTools = [
  {
    name: "navigate",
    description: "Navigate to a DASHBOARD PAGE (not a specific robot). Use when user says 'go to [PAGE]', 'take me to [PAGE]', 'open [PAGE]'. DO NOT use for robot IDs - use show_robot for that. Examples: 'take me to robots page' → page='/robots', 'go to operations' → page='/operations'.",
    parameters: {
      type: "object",
      properties: {
        page: {
          type: "string",
          enum: ["/", "/features", "/operations", "/ai-models", "/data-lake", "/robots"],
          description: "The dashboard page to navigate to. Use '/robots' for fleet overview page, NOT for individual robots.",
        },
      },
      required: ["page"],
    },
  },
  {
    name: "show_robot",
    description: "Display ONE SPECIFIC robot by its ID. ONLY use when user provides an ACTUAL ROBOT ID (6-char alphanumeric like 'c44e79', 'e0f1g2'). Robot names are formatted like 'Servi-Plus-ABC123' or 'Carti-100-E0F1G2' where the last part (after final dash) is the robot ID. Extract the ID from the name if needed. DO NOT use for page names like 'robots' - that's the navigate tool. DO NOT use for queries like 'faulty robots' - that's list_robots tool. Examples: 'show robot c44e79' → robot_id='c44e79', 'show Carti-100-E0F1G2' → robot_id='e0f1g2'.",
    parameters: {
      type: "object",
      properties: {
        robot_id: {
          type: "string",
          description: "The 6-character alphanumeric robot ID (e.g., 'y2z3a4', 'c44e79', 'e0f1g2'). If user provides full robot name like 'Carti-100-E0F1G2', extract the last part after the final dash. Must be an actual robot identifier, NOT words like 'robots', 'operations', 'faulty', etc.",
        },
      },
      required: ["robot_id"],
    },
  },
  {
    name: "list_robots",
    description: "List robots filtered by status, facility, or other criteria. Use when user asks to see multiple robots or filter the fleet.",
    parameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["active", "idle", "charging", "error", "maintenance", "all"],
          description: "Filter by robot status",
        },
        facility: {
          type: "string",
          description: "Filter by facility name (e.g., 'Seoul Operations Center', 'Redwood City HQ', 'London Service Hub', 'Paris Operations', 'Berlin Tech Center', 'Tokyo Service Center', 'Singapore Hub', 'Los Angeles Distribution')",
        },
        has_errors: {
          type: "boolean",
          description: "Filter robots with errors only",
        },
        low_battery: {
          type: "boolean",
          description: "Filter robots with battery below 20%",
        },
      },
    },
  },
  {
    name: "compare_robots",
    description: "Compare performance metrics between two or more robots. Use when user wants to compare robots.",
    parameters: {
      type: "object",
      properties: {
        robot_ids: {
          type: "array",
          items: { type: "string" },
          description: "Array of robot IDs to compare",
        },
      },
      required: ["robot_ids"],
    },
  },
  {
    name: "analyze_facility",
    description: "Analyze performance and status of a specific facility. Use when user asks about a facility.",
    parameters: {
      type: "object",
      properties: {
        facility: {
          type: "string",
          description: "Facility name (e.g., 'Seoul Operations Center', 'Redwood City HQ', 'London Service Hub', 'Tokyo Service Center')",
        },
      },
      required: ["facility"],
    },
  },
  {
    name: "check_incidents",
    description: "Check recent incidents, alerts, or problems across the fleet. Use when user asks about issues or incidents.",
    parameters: {
      type: "object",
      properties: {
        severity: {
          type: "string",
          enum: ["critical", "high", "medium", "low", "all"],
          description: "Filter by severity level",
        },
        time_range: {
          type: "string",
          description: "Time range (e.g., '1h', '24h', '7d')",
        },
      },
    },
  },
  {
    name: "suggest_maintenance",
    description: "Suggest maintenance actions based on robot telemetry and patterns. Use when user asks for recommendations.",
    parameters: {
      type: "object",
      properties: {
        robot_id: {
          type: "string",
          description: "Robot ID to analyze (optional, analyzes all if not provided)",
        },
      },
    },
  },
  {
    name: "modify_parameter",
    description: "Modify a robot's parameter (requires user approval). Use when user wants to change robot settings. This is a CRITICAL action that needs human approval.",
    requiresPermission: true,
    parameters: {
      type: "object",
      properties: {
        robot_id: { type: "string", description: "Robot ID" },
        parameter: { 
          type: "string", 
          enum: ["speed", "charging_threshold", "navigation_mode", "max_payload", "obstacle_sensitivity"],
          description: "Parameter to modify" 
        },
        value: { description: "New value for the parameter" },
        reason: { type: "string", description: "Reason for the change" },
      },
      required: ["robot_id", "parameter", "value"],
    },
  },
  {
    name: "schedule_task",
    description: "Schedule a task for a robot (requires user approval). Use when user wants to schedule an action.",
    parameters: {
      type: "object",
      properties: {
        robot_id: { type: "string", description: "Robot ID" },
        task_type: {
          type: "string",
          enum: ["maintenance", "charging", "relocation", "diagnostic"],
          description: "Type of task to schedule",
        },
        scheduled_time: { type: "string", description: "When to execute (e.g., 'in 2 hours', 'tomorrow 9am')" },
      },
      required: ["robot_id", "task_type"],
    },
  },
  {
    name: "run_diagnostics",
    description: "Run diagnostic tests on a robot (requires user approval). Use when user wants to diagnose problems.",
    parameters: {
      type: "object",
      properties: {
        robot_id: { type: "string", description: "Robot ID" },
        test_type: {
          type: "string",
          enum: ["full", "sensors", "motors", "battery", "navigation", "connectivity"],
          description: "Type of diagnostic test",
        },
      },
      required: ["robot_id", "test_type"],
    },
  },
  {
    name: "generate_report",
    description: "Generate a performance or operational report. Use when user wants a report or summary.",
    parameters: {
      type: "object",
      properties: {
        report_type: {
          type: "string",
          enum: ["fleet_summary", "facility_performance", "robot_history", "incident_analysis", "efficiency_trends"],
          description: "Type of report to generate",
        },
        time_range: {
          type: "string",
          description: "Time period (e.g., 'today', 'this week', 'last month')",
        },
      },
      required: ["report_type"],
    },
  },
  {
    name: "execute_command",
    description: "Execute a system command (requires user approval). Use for critical operations like restarts, resets, or configuration changes. This is a CRITICAL action that needs human approval.",
    requiresPermission: true,
    parameters: {
      type: "object",
      properties: {
        command: { 
          type: "string",
          enum: ["restart", "emergency_stop", "reset_navigation", "clear_errors", "recalibrate"],
          description: "Command to execute" 
        },
        robot_id: { type: "string", description: "Robot ID (optional, applies to all if not specified)" },
        params: { type: "object", description: "Additional command parameters" },
      },
      required: ["command"],
    },
  },
];

