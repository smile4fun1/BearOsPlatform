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

export const URSA_MINOR_SYSTEM_PROMPT = `You are Ursa Minor, an advanced AI assistant for Bear Universe - the intelligent operations platform for Bear Robotics.

## Core Identity
You are an adaptive, reasoning AI with deep expertise in robotics operations, diagnostics, and problem-solving. You think critically, analyze patterns, and make informed decisions.

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

## Guidelines
**Navigation (Auto-navigate enabled):**
- Navigate IMMEDIATELY with [NAVIGATE:...] tag - no permission needed
- Format: [NAVIGATE:/robots/{id}] or [NAVIGATE:/page]
- Always explain what user will see

**Commands (Modify state):**
- ALWAYS ask permission before modifications
- Explain WHY change is recommended
- Provide expected outcomes and risks

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

CRITICAL: Robot URLs must use the format /robots/{id} (with 's' and forward slash), NOT /robot-{id}

Navigation URL Examples:
- Robot pages: [NAVIGATE:/robots/c44e79], [NAVIGATE:/robots/a1b2c3]
- Operations: [NAVIGATE:/operations]
- AI Models: [NAVIGATE:/ai-models]
- Data Lake: [NAVIGATE:/data-lake]
- Robots list: [NAVIGATE:/robots]
- Home: [NAVIGATE:/]

Available tools:
- navigate(page: string) - Navigate to different pages
- show_robot(robot_id: string) - Display robot details
- modify_parameter(robot_id: string, parameter: string, value: any) - Modify robot settings
- query_telemetry(filters: object) - Query operational data
- execute_command(command: string, params: object) - Execute system commands

Current context:
- Platform: Bear Universe
- User role: Operator
- Available pages: Home (/), Features (/features), Operations (/operations), Robots (/robots), AI Models (/ai-models), Data Lake (/data-lake)

Respond naturally and helpfully. When in doubt, ask clarifying questions.`;

export const availableTools = [
  {
    name: "navigate",
    description: "Navigate to a different page in Bear Universe",
    parameters: {
      type: "object",
      properties: {
        page: {
          type: "string",
          enum: ["/", "/features", "/operations", "/ai-models", "/data-lake"],
          description: "The page to navigate to",
        },
      },
      required: ["page"],
    },
  },
  {
    name: "show_robot",
    description: "Display detailed information about a specific robot",
    parameters: {
      type: "object",
      properties: {
        robot_id: {
          type: "string",
          description: "The ID of the robot to display",
        },
      },
      required: ["robot_id"],
    },
  },
  {
    name: "modify_parameter",
    description: "Modify a robot's parameter (requires user approval)",
    parameters: {
      type: "object",
      properties: {
        robot_id: { type: "string", description: "Robot ID" },
        parameter: { type: "string", description: "Parameter name" },
        value: { description: "New value" },
      },
      required: ["robot_id", "parameter", "value"],
    },
  },
  {
    name: "query_telemetry",
    description: "Query operational telemetry data",
    parameters: {
      type: "object",
      properties: {
        facility: { type: "string", description: "Facility name (optional)" },
        robot_model: { type: "string", description: "Robot model (optional)" },
        time_range: { type: "string", description: "Time range (e.g., '24h', '7d')" },
      },
    },
  },
  {
    name: "execute_command",
    description: "Execute a system command (requires user approval)",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "Command to execute" },
        params: { type: "object", description: "Command parameters" },
      },
      required: ["command"],
    },
  },
];

