import { NextResponse } from "next/server";
import OpenAI from "openai";
import { URSA_MINOR_SYSTEM_PROMPT, availableTools } from "@/lib/chatContext";
import { composeCurationResponse } from "@/lib/dataCurator";
import { BEAR_ROBOTICS_KNOWLEDGE } from "@/lib/bearKnowledge";
import { getAIDataContext, getRobotStats, getFleetStats, getOperationsStats, parseTimeRange, getTimeRangeLabel } from "@/lib/aiDataProvider";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: Request) {
  try {
    const { messages, model = "ursa-minor", context, autoNavigate } = await request.json();
    
    console.log("🐻 [API] Received autoNavigate:", autoNavigate);
    console.log("🐻 [API] Last message:", messages[messages.length - 1]?.content);

    // If no OpenAI key, return intelligent mock response
    if (!openai) {
      console.log("🐻 [API] No OpenAI key, using mock response");
      try {
        const mockResponse = generateMockResponse(messages[messages.length - 1]?.content || "");
        return NextResponse.json({
          response: mockResponse,
          needsPermission: false,
          toolCalls: [],
        });
      } catch (mockError) {
        console.error("🐻 [API] Mock response error:", mockError);
        return NextResponse.json({
          response: "I'm here to help! Try asking about fleet status, robot details, or navigate to different pages.",
          needsPermission: false,
          toolCalls: [],
        });
      }
    }
    
    console.log("🐻 [API] Using GPT-4o-mini with autoNavigate:", autoNavigate);

    // Get current universe data for context
    const universe = composeCurationResponse();
    
    // Get REAL platform data based on user query
    const userQuery = messages[messages.length - 1]?.content || "";
    const realData = getAIDataContext(userQuery);
    
    // Build comprehensive context with auto-navigate instruction and REAL DATA
    const contextMessage = {
      role: "system" as const,
      content: `${URSA_MINOR_SYSTEM_PROMPT}

## USER PREFERENCES
**Auto-Navigate**: ${autoNavigate ? 'ENABLED - Navigate immediately without asking' : 'DISABLED - Ask before navigating'}

${autoNavigate ? `
IMPORTANT: User has auto-navigate ENABLED. When they request navigation or ask to see a robot:
- Respond with the [NAVIGATE:...] tag IMMEDIATELY
- Do NOT ask for permission
- Do NOT ask "Would you like me to..."
- Just navigate and tell them you're doing it

Example: "show me robot c44e79" -> "[NAVIGATE:/robots/c44e79]\n\n**Displaying robot C44E79**..."
` : ''}

## Bear Robotics Knowledge Base
${BEAR_ROBOTICS_KNOWLEDGE}

## Current Platform State (${realData.timestamp})
**Page**: ${context?.currentPage || 'unknown'}
**Page Name**: ${context?.pageName || 'unknown'}
**Time Range**: ${realData.timeRange}

## REAL FLEET DATA (Use these exact numbers!)
**Total Robots**: ${realData.fleet.total}
**Status Breakdown**:
- Active: ${realData.fleet.active} robots
- Idle: ${realData.fleet.idle} robots
- Charging: ${realData.fleet.charging} robots
- Error: ${realData.fleet.error} robots
- Maintenance: ${realData.fleet.maintenance} robots

**Fleet Averages**:
- Battery Level: ${realData.fleet.averages.battery}%
- Uptime: ${realData.fleet.averages.uptime}%
- Trips per Robot: ${realData.fleet.averages.tripsPerRobot}

**Fleet Totals (${realData.timeRange})**:
- Total Distance: ${realData.fleet.totals.distance} km
- Total Orders Served: ${realData.fleet.totals.orders}
- Total Trips: ${realData.fleet.totals.trips}

**Facilities**:
${Object.entries(realData.fleet.facilities).map(([name, count]) => `- ${name}: ${count} robots`).join('\n')}

${realData.fleet.alerts.lowBattery.length > 0 ? `
**⚠️ Low Battery Alerts** (${realData.fleet.alerts.lowBattery.length}):
${realData.fleet.alerts.lowBattery.map(r => `- ${r.name} (${r.id}): ${r.battery}% at ${r.facility}`).join('\n')}
` : ''}

${realData.fleet.alerts.errors.length > 0 ? `
**🔴 Error Alerts** (${realData.fleet.alerts.errors.length}):
${realData.fleet.alerts.errors.map(r => `- ${r.name} (${r.id}): ${r.error}`).join('\n')}
` : ''}

## REAL OPERATIONS DATA
**Total Operations**: ${realData.operations.total}
**Success Rate**: ${realData.operations.successRate}%
- Successful: ${realData.operations.successful}
- Pending: ${realData.operations.pending}
- Failed: ${realData.operations.failed}

**By Facility**:
${Object.entries(realData.operations.byFacility).map(([name, count]) => `- ${name}: ${count} ops`).join('\n')}

**By Type**:
${Object.entries(realData.operations.byType).map(([name, count]) => `- ${name}: ${count} ops`).join('\n')}

## TRAINING MODELS
${universe.trainingPlans.map(p => `- ${p.model.name} (${p.model.size}): ${p.model.currentPhase}`).join('\n')}

CRITICAL: Use the REAL DATA numbers above in your responses. These are actual values from the platform, not estimates.`,
    };

    // Call OpenAI with function calling using cost-efficient GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-efficient model: ~15x cheaper than GPT-4 Turbo
      messages: [contextMessage, ...messages],
      tools: availableTools.map((tool) => ({
        type: "function" as const,
        function: tool,
      })),
      temperature: 0.7,
      max_tokens: 1000, // Increased for more comprehensive responses
    });

    const assistantMessage = completion.choices[0].message;
    const toolCalls = assistantMessage.tool_calls?.map((tc) => {
      // Type guard for function tool calls
      if (tc.type === 'function' && 'function' in tc) {
        return {
          id: tc.id,
          name: tc.function.name,
          parameters: JSON.parse(tc.function.arguments),
          status: "pending" as const,
        };
      }
      return null;
    }).filter((tc): tc is NonNullable<typeof tc> => tc !== null) || [];

    // Check if any tool call requires permission
    const needsPermission = toolCalls.some(
      (tc) => tc.name === "modify_parameter" || tc.name === "execute_command"
    );

    // Provide a default message if content is null (e.g., when only making tool calls)
    let responseContent = assistantMessage.content || "";
    if (!responseContent && toolCalls.length > 0) {
      responseContent = "I'm processing your request...";
    }

    return NextResponse.json({
      response: responseContent,
      needsPermission,
      toolCalls,
    });
  } catch (error) {
    console.error("🐻 [API] Chat error:", error);
    
    // Return a 200 status with error message to prevent client-side crashes
    return NextResponse.json({
      response: "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
      needsPermission: false,
      toolCalls: [],
      error: true,
    });
  }
}

/**
 * Generate intelligent mock response when OpenAI is not available (using REAL DATA)
 */
function generateMockResponse(userMessage: string): string {
  try {
    const lowerMessage = userMessage.toLowerCase();
    const realData = getAIDataContext(userMessage);
    const timeLabel = realData.timeRange;
  
  // Robot-specific queries with ID extraction
  if (lowerMessage.includes("robot") && /[a-z0-9]{6}/.test(userMessage)) {
    const robotId = userMessage.match(/[a-z0-9]{6}/)?.[0];
    if (robotId) {
      const robotStats = getRobotStats(robotId);
      if (robotStats) {
        return `[NAVIGATE:/robots/${robotId}]

**Displaying robot ${robotStats.name}** (${robotId.toUpperCase()})...

**Quick Stats:**
- Status: ${robotStats.status.toUpperCase()}
- Battery: ${robotStats.metrics.battery}%
- Uptime: ${robotStats.metrics.uptime}%
- Location: ${robotStats.facility}, ${robotStats.city}
- Trips Completed: ${robotStats.metrics.tripsCompleted}
- Distance: ${robotStats.metrics.totalDistanceKm} km

Taking you to the comprehensive dashboard with live telemetry, navigation map, and RFE diagnostic tools.`;
      }
    }
    return `[NAVIGATE:/robots/${robotId}]

**Displaying robot ${robotId?.toUpperCase()}**... Taking you to its comprehensive dashboard with live telemetry, navigation map, and RFE diagnostic tools.`;
  }
  
  // Fleet status queries
  if (lowerMessage.includes("fleet") || lowerMessage.includes("how many") || lowerMessage.includes("status")) {
    return `**Fleet Status (${timeLabel}):**

📊 **Overview:**
- Total Robots: **${realData.fleet.total}**
- Active: **${realData.fleet.active}** (${Math.round((realData.fleet.active / realData.fleet.total) * 100)}%)
- Idle: **${realData.fleet.idle}**
- Charging: **${realData.fleet.charging}**
- Error: **${realData.fleet.error}**
- Maintenance: **${realData.fleet.maintenance}**

⚡ **Performance:**
- Avg Battery: **${realData.fleet.averages.battery}%**
- Avg Uptime: **${realData.fleet.averages.uptime}%**
- Total Distance: **${realData.fleet.totals.distance} km**
- Orders Served: **${realData.fleet.totals.orders}**
- Trips Completed: **${realData.fleet.totals.trips}**

${realData.fleet.alerts.errors.length > 0 ? `
🔴 **Active Errors (${realData.fleet.alerts.errors.length}):**
${realData.fleet.alerts.errors.slice(0, 3).map(e => `- ${e.name} (${e.id}): ${e.error}`).join('\n')}
` : '✅ No active errors'}`;
  }
  
  // Uptime and performance queries
  if (lowerMessage.includes("uptime") || lowerMessage.includes("performance")) {
    return `**Fleet Performance (${timeLabel}):**

⚡ **Key Metrics:**
- Average Uptime: **${realData.fleet.averages.uptime}%**
- Average Battery: **${realData.fleet.averages.battery}%**
- Success Rate: **${realData.operations.successRate}%**

📍 **By Facility:**
${Object.entries(realData.fleet.facilities).map(([name, count]) => `- ${name}: **${count} robots**`).join('\n')}

📊 **Operations:**
- Total: **${realData.operations.total}**
- Successful: **${realData.operations.successful}**
- Failed: **${realData.operations.failed}**

Would you like to see detailed metrics for a specific facility or robot?`;
  }
  
  // Alert and incident queries
  if (lowerMessage.includes("alert") || lowerMessage.includes("incident") || lowerMessage.includes("problem") || lowerMessage.includes("error")) {
    const totalAlerts = realData.fleet.alerts.lowBattery.length + realData.fleet.alerts.errors.length;
    
    if (totalAlerts === 0) {
      return `✅ **All systems nominal!**

No active alerts at this time. The fleet is operating smoothly across all facilities.

Current status:
- ${realData.fleet.active} robots active
- ${realData.fleet.averages.uptime}% average uptime
- ${realData.operations.successRate}% operation success rate`;
    }
    
    return `**Active Alerts (${totalAlerts} total):**

${realData.fleet.alerts.errors.length > 0 ? `
🔴 **Errors (${realData.fleet.alerts.errors.length}):**
${realData.fleet.alerts.errors.map(e => `- **${e.name}** (${e.id}): ${e.error}`).join('\n')}
` : ''}

${realData.fleet.alerts.lowBattery.length > 0 ? `
⚠️ **Low Battery (${realData.fleet.alerts.lowBattery.length}):**
${realData.fleet.alerts.lowBattery.map(r => `- **${r.name}** (${r.id}): ${r.battery}% at ${r.facility}`).join('\n')}
` : ''}

Would you like me to navigate you to a specific robot for diagnostics?`;
  }
  
  // Navigation commands - Smart detection
  if (lowerMessage.includes("navigate") || lowerMessage.includes("go to") || lowerMessage.includes("show me") || lowerMessage.includes("take me") || lowerMessage.includes("display") || lowerMessage.includes("open")) {
    if (lowerMessage.includes("operation")) {
      return "[NAVIGATE:/operations]\n\n**Taking you to Operations Dashboard**... You'll see real-time telemetry from all 6 facilities with interactive sortable tables, live KPIs, and facility breakdowns.";
    }
    if (lowerMessage.includes("ai") || lowerMessage.includes("model") || lowerMessage.includes("training")) {
      return "[NAVIGATE:/ai-models]\n\n**Opening AI Models page**... Monitoring training progress for Ursa Minor (40B), Ursa Major (70B), and Aurora Bear Lore (120B).";
    }
    if (lowerMessage.includes("data") || lowerMessage.includes("lake") || lowerMessage.includes("pipeline")) {
      return "[NAVIGATE:/data-lake]\n\n**Navigating to Data Lake**... Exploring data sources, pipeline architecture, and real-time streaming analytics.";
    }
    if (lowerMessage.includes("robots") || lowerMessage.includes("fleet") || (lowerMessage.includes("all") && lowerMessage.includes("robot"))) {
      return "[NAVIGATE:/robots]\n\n**Opening Robot Fleet Management**... Viewing all 101 active robots with search, filters, and comprehensive diagnostics.";
    }
    if (lowerMessage.includes("home") || lowerMessage.includes("dashboard") || lowerMessage.includes("main")) {
      return "[NAVIGATE:/]\n\n**Returning to Home Dashboard**... Executive overview with AI constellation status and upcoming features.";
    }
    if (lowerMessage.includes("feature")) {
      return "[NAVIGATE:/features]\n\n**Opening Features page**... Comprehensive showcase of all Bear Universe capabilities.";
    }
  }
  
  // Direct page requests without explicit "navigate" keyword
  if (lowerMessage.match(/^(operations|robots|ai models?|data lake|features?|home)$/i)) {
    const pageName = lowerMessage.toLowerCase();
    if (pageName.includes("operation")) return `[NAVIGATE:/operations]\n\n**Opening Operations Dashboard**...`;
    if (pageName.includes("robot")) return `[NAVIGATE:/robots]\n\n**Opening Robot Fleet**...`;
    if (pageName.includes("ai") || pageName.includes("model")) return `[NAVIGATE:/ai-models]\n\n**Opening AI Models**...`;
    if (pageName.includes("data")) return `[NAVIGATE:/data-lake]\n\n**Opening Data Lake**...`;
    if (pageName.includes("feature")) return `[NAVIGATE:/features]\n\n**Opening Features**...`;
    if (pageName.includes("home")) return `[NAVIGATE:/]\n\n**Opening Home**...`;
  }
  
  // Parameter modification queries
  if (lowerMessage.includes("parameter") || lowerMessage.includes("modify") || lowerMessage.includes("change") || lowerMessage.includes("adjust")) {
    return "I can help you modify robot parameters, but I'll need your **explicit permission** before making any changes. This is a safety feature to prevent accidental modifications.\n\n**Example commands:**\n• \"Set robot c44e79 speed to 1.2 m/s\"\n• \"Adjust robot a1b2c3 charging threshold to 20%\"\n• \"Change navigation mode for robot x9y8z7 to cautious\"\n\nWhat parameter would you like to modify? Please specify the robot ID and the desired change.";
  }
  
  // Status queries
  if (lowerMessage.includes("status") || lowerMessage.includes("health") || lowerMessage.includes("system")) {
    return "**System Status Overview:**\n\n✅ **Operational** (7 systems)\n• Fleet Operations • Data Pipeline • AI Models • API Gateway • Database • Authentication • Seoul Factory\n\n⚠️ **Degraded** (1 system)\n• Busan Pilot Cluster - Navigation variance\n\n🔴 **Outages** (0 systems)\n\nOverall system health: **96.8%** - All critical systems operational. Click the **Live** button in the header for detailed status breakdown.";
  }
  
  // Facility queries
  if (lowerMessage.includes("facility") || lowerMessage.includes("facilities") || lowerMessage.includes("location")) {
    return "**Active Deployment Facilities (6):**\n\n1. **Seoul HQ Automation Lab** (Seoul, South Korea)\n   • 24 robots • 98.2% uptime • R&D and testing\n\n2. **Seoul Servi Factory** (Seoul, South Korea)\n   • 18 robots • 97.5% uptime • Manufacturing ops\n\n3. **Busan Pilot Cluster** (Busan, South Korea)\n   • 15 robots • 94.1% uptime • Beta deployment\n\n4. **Tokyo Robotics Studio** (Tokyo, Japan)\n   • 21 robots • 96.8% uptime • APAC expansion\n\n5. **Silicon Valley Command** (Mountain View, CA, USA)\n   • 12 robots • 95.8% uptime • US operations\n\n6. **Singapore Experience Hub** (Singapore)\n   • 11 robots • 95.3% uptime • Customer demos\n\nWhich facility would you like to learn more about?";
  }
  
  // Help queries
  if (lowerMessage.includes("help") || lowerMessage.includes("what can you") || lowerMessage.includes("capabilities")) {
    return "**I'm Ursa Minor, your Bear Universe assistant!** 🐻\n\nHere's what I can help you with:\n\n**📊 Fleet Management**\n• View specific robot details (\"show robot c44e79\")\n• Check fleet uptime and performance\n• Monitor facility status\n• Query telemetry data\n\n**🗺️ Navigation**\n• Navigate through dashboards\n• Access robot detail pages\n• Jump to specific features\n\n**⚙️ Control & Configuration**\n• Modify robot parameters (with your permission)\n• Execute system commands (with approval)\n• Manage robot settings\n\n**🚨 Monitoring**\n• View active alerts and incidents\n• Check system health\n• Analyze performance trends\n\n**💡 Try asking:**\n• \"What's the fleet performance?\"\n• \"Show me robot c44e79\"\n• \"Are there any alerts?\"\n• \"Navigate to operations\"\n\nWhat would you like to do?";
  }
  
  // AI model queries
  if (lowerMessage.includes("ursa") || lowerMessage.includes("aurora") || lowerMessage.includes("who are you")) {
    return "I'm **Ursa Minor**, a 40B parameter AI assistant specifically trained for Bear Universe operations. I'm part of the Bear AI Constellation:\n\n**🐻 Ursa Minor (40B)** - That's me!\n• Interactive assistant for operators\n• Navigation, robot control, query answering\n• Permission-based command execution\n\n**🐻 Ursa Major (70B)**\n• Fleet orchestrator and automation planner\n• Multi-agent task delegation\n• KPI analysis and diagnostic briefs\n\n**🐻 Aurora Bear Lore (120B)**\n• Institutional knowledge core\n• Product info, partnerships, compliance\n• Customer support and executive briefings\n\nI'm currently at **offline-eval** phase, constantly learning from your interactions. How can I assist you today?";
  }
  
  // Default helpful response
  return "I'm here to help you navigate Bear Universe and manage your robot fleet. 🐻\n\n**Quick suggestions:**\n• Ask about **fleet status** or **performance**\n• View **specific robot details** (e.g., \"show robot c44e79\")\n• Check for **alerts** or **incidents**\n• Navigate to any **dashboard** (operations, AI models, data lake)\n• Query **facility** information\n• Get **system status**\n\nWhat would you like to know or where would you like to go?";
  } catch (error) {
    console.error("🐻 [Mock] Error generating response:", error);
    return "I'm here to help! How can I assist you with Bear Universe today?";
  }
}

